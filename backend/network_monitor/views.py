from django.shortcuts import render
import nmap
import speedtest
from django.http import JsonResponse
from scapy.all import ARP, Ether, srp
import socket
import logging
from django.conf import settings
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Subscriber, NetworkScan, SpeedTest, UserProfile
from .serializers import (
    SubscriberSerializer, NetworkScanSerializer, 
    SpeedTestSerializer, UserProfileSerializer
)

logger = logging.getLogger(__name__)

def staff_required(user):
    """Check if user is staff member"""
    if not user.is_staff:
        raise PermissionDenied
    return True

def index(request):
    """
    Root endpoint that provides API information
    """
    api_info = {
        'name': 'CyberMamba Network Monitor API',
        'version': '1.0',
        'endpoints': {
            'Network Scan': '/api/scan/',
            'Speed Test': '/api/speed/',
            'Network Stats': '/api/stats/',
            'Subscribe': '/api/subscribe/',
            'Admin Interface': '/admin/'
        }
    }
    return JsonResponse(api_info)

class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser

class IsSubscriber(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_subscriber or request.user.is_superuser)

class SuperUserDashboardView(APIView):
    permission_classes = [IsSuperUser]
    
    def get(self, request):
        # Get system-wide statistics and data
        subscribers = Subscriber.objects.all()
        network_scans = NetworkScan.objects.all()[:10]
        speed_tests = SpeedTest.objects.all()[:10]
        
        data = {
            'total_subscribers': subscribers.count(),
            'active_subscribers': subscribers.filter(agreed_to_terms=True).count(),
            'recent_network_scans': NetworkScanSerializer(network_scans, many=True).data,
            'recent_speed_tests': SpeedTestSerializer(speed_tests, many=True).data,
            'recent_subscribers': SubscriberSerializer(subscribers[:5], many=True).data,
        }
        return Response(data)

class UserDashboardView(APIView):
    permission_classes = [IsSubscriber]
    template_name = 'network_monitor/user_dashboard.html'
    
    def get(self, request):
        try:
            subscriber = request.user.subscriber
            network_scans = NetworkScan.objects.filter(user=request.user)[:5]
            speed_tests = SpeedTest.objects.filter(user=request.user)[:5]
            
            context = {
                'subscriber': subscriber,
                'recent_network_scans': network_scans,
                'recent_speed_tests': speed_tests,
            }
            return render(request, self.template_name, context)
        except Subscriber.DoesNotExist:
            messages.error(request, 'Subscriber profile not found')
            return render(request, self.template_name, {'error': 'Subscriber profile not found'})

@api_view(['POST'])
def subscribe(request):
    """
    Handle new subscriber registration.
    Prevents superuser registration through this endpoint.
    """
    if request.user.is_authenticated:
        return Response(
            {'error': 'Already authenticated'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = SubscriberSerializer(data=request.data)
    if serializer.is_valid():
        # Create user account but ensure it's not a superuser
        user = CustomUser.objects.create_user(
            username=serializer.validated_data['email'],
            email=serializer.validated_data['email'],
            is_subscriber=True
        )
        # Create subscriber profile
        subscriber = serializer.save(user=user)
        return Response(
            SubscriberSerializer(subscriber).data, 
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Modified network scan view with permission checks
@api_view(['GET'])
@permission_classes([IsSubscriber])
def scan_network(request):
    # Get network range from settings or use default
    network = getattr(settings, 'NETWORK_RANGE', '192.168.1.0/24')
    devices = []
    
    try:
        # ARP scan for live hosts
        arp = ARP(pdst=network)
        ether = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether/arp
        result = srp(packet, timeout=3, verbose=False)[0]
        
        for sent, received in result:
            try:
                hostname = socket.gethostbyaddr(received.psrc)[0]
            except socket.herror as e:
                logger.warning(f"Could not resolve hostname for {received.psrc}: {e}")
                hostname = "Unknown"
                
            devices.append({
                'ip': received.psrc,
                'mac': received.hwsrc,
                'hostname': hostname
            })
            
        # Update user's last network scan time
        if hasattr(request.user, 'profile'):
            request.user.profile.last_network_scan = timezone.now()
            request.user.profile.save()
        
        # Create NetworkScan record
        scan = NetworkScan.objects.create(
            user=request.user,
            devices_found=devices
        )
        return Response(NetworkScanSerializer(scan).data)
    except Exception as e:
        logger.error(f"Error scanning network: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Modified speed test view with permission checks
@api_view(['GET'])
@permission_classes([IsSubscriber])
def speed_test(request):
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        
        download = round(st.download() / 1_000_000, 2)  # Convert to Mbps
        upload = round(st.upload() / 1_000_000, 2)
        ping = round(st.results.ping, 2)
        
        # Update user's last speed test time
        if hasattr(request.user, 'profile'):
            request.user.profile.last_speed_test = timezone.now()
            request.user.profile.save()
        
        # Create SpeedTest record
        test = SpeedTest.objects.create(
            user=request.user,
            download_speed=download,
            upload_speed=upload,
            ping=ping
        )
        return Response(SpeedTestSerializer(test).data)
    except Exception as e:
        logger.error(f"Speed test failed: {e}")
        return Response(
            {'error': 'Speed test failed',
            'details': str(e)
        }, status=500)

@login_required
@user_passes_test(staff_required)
def network_stats(request):
    try:
        # Get devices
        devices_response = scan_network(request)
        if devices_response.status_code != 200:
            return devices_response
        
        # Get speed test
        speed_response = speed_test(request)
        if speed_response.status_code != 200:
            return speed_response
            
        return JsonResponse({
            'devices': devices_response.json()['devices'],
            'speed_test': speed_response.json()['speed_test']
        })
    except Exception as e:
        logger.error(f"Failed to get network stats: {e}")
        return JsonResponse({
            'error': 'Failed to get network stats',
            'details': str(e)
        }, status=500)

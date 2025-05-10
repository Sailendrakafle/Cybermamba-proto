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
from rest_framework.permissions import IsAdminUser, AllowAny
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.middleware.csrf import get_token
from .models import Subscriber, NetworkScan, SpeedTest, UserProfile, CustomUser
from .serializers import (
    SubscriberSerializer, NetworkScanSerializer, 
    SpeedTestSerializer, UserProfileSerializer
)
from django.contrib import messages
from .models import NewsPost
from .serializers import NewsPostSerializer

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
        'name': 'EchoMon Network Monitor API',
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
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
    """Handle user login"""
    # Ensure CSRF token is set
    get_token(request)
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'success': False,
            'message': 'Please provide both username and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        if user.is_active:
            login(request, user)
            return Response({
                'success': True,
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'is_subscriber': user.is_subscriber
                }
            })
        else:
            return Response({
                'success': False,
                'message': 'Account is disabled'
            }, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({
            'success': False,
            'message': 'Invalid credentials',
            'showRegister': True  # Indicate that registration option should be shown
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def register_view(request):
    """Handle user registration"""
    # Ensure CSRF token is set
    get_token(request)
    
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    name = request.data.get('name')
    
    if not all([username, password, email, name]):
        return Response({
            'success': False,
            'message': 'Please provide all required fields'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if CustomUser.objects.filter(username=username).exists():
        return Response({
            'success': False,
            'message': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    if CustomUser.objects.filter(email=email).exists():
        return Response({
            'success': False,
            'message': 'Email already registered'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create user
        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_subscriber=True
        )
        
        # Split name into first_name and last_name
        names = name.split(' ', 1)
        user.first_name = names[0]
        user.last_name = names[1] if len(names) > 1 else ''
        user.save()
        
        # Create subscriber profile
        subscriber = Subscriber.objects.create(
            user=user,
            name=name,
            email=email,
            agreed_to_terms=True
        )
        
        # Log the user in
        login(request, user)
        
        return Response({
            'success': True,
            'user': {
                'username': user.username,
                'email': user.email,
                'is_subscriber': user.is_subscriber
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
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
        # Log the user in after registration
        login(request, user)
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
        # ARP scan for live hosts with timeout handling
        arp = ARP(pdst=network)
        ether = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether/arp
        
        try:
            result = srp(packet, timeout=5, verbose=False)[0]
        except Exception as e:
            logger.error(f"Network scan timeout: {e}")
            return Response(
                {'error': 'Network scan timed out. Please try again.'},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )

        # Get previous scan for comparison
        try:
            previous_scan = NetworkScan.objects.filter(user=request.user).latest('timestamp')
            previous_devices = previous_scan.devices_found
        except NetworkScan.DoesNotExist:
            previous_devices = []

        current_time = timezone.now()
        
        for sent, received in result:
            try:
                hostname = socket.gethostbyaddr(received.psrc)[0]
            except socket.herror as e:
                logger.warning(f"Could not resolve hostname for {received.psrc}: {e}")
                hostname = "Unknown"

            # Check if device was seen in previous scan
            previous_device = next(
                (d for d in previous_devices if d.get('mac') == received.hwsrc),
                None
            )
                
            device = {
                'ip': received.psrc,
                'mac': received.hwsrc,
                'hostname': hostname,
                'last_seen': current_time.isoformat(),
                'status': 'online',
                'first_seen': previous_device.get('first_seen', current_time.isoformat()) if previous_device else current_time.isoformat()
            }
            devices.append(device)

        # Add previously seen devices as offline if not found in current scan
        if previous_devices:
            current_macs = {d['mac'] for d in devices}
            for old_device in previous_devices:
                if old_device['mac'] not in current_macs:
                    old_device.update({
                        'status': 'offline',
                        'last_seen': old_device.get('last_seen', '')
                    })
                    devices.append(old_device)
            
        # Update user's last network scan time
        if hasattr(request.user, 'profile'):
            request.user.profile.last_network_scan = current_time
            request.user.profile.save()
        
        # Create NetworkScan record
        scan = NetworkScan.objects.create(
            user=request.user,
            devices_found=devices
        )
        
        return Response({
            'data': {
                'devices': devices,
                'timestamp': current_time.isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Error scanning network: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class SpeedTestError(Exception):
    def __init__(self, message: str, error_type: str = 'general'):
        self.message = message
        self.error_type = error_type
        super().__init__(self.message)

@api_view(['GET'])
@permission_classes([IsSubscriber])
def speed_test(request):
    try:
        st = speedtest.Speedtest(timeout=30)  # Set a 30-second timeout
        
        # Get best server with timeout handling
        try:
            st.get_best_server()
        except Exception as e:
            logger.error(f"Failed to find speedtest server: {e}")
            raise SpeedTestError(
                "Unable to find a speed test server. Please try again later.",
                "server_error"
            )
        
        # Measure download speed
        try:
            download = round(st.download() / 1_000_000, 2)  # Convert to Mbps
        except Exception as e:
            logger.error(f"Download test failed: {e}")
            raise SpeedTestError(
                "Download speed test failed. Please check your connection.",
                "download_error"
            )
        
        # Measure upload speed
        try:
            upload = round(st.upload() / 1_000_000, 2)
        except Exception as e:
            logger.error(f"Upload test failed: {e}")
            raise SpeedTestError(
                "Upload speed test failed. Please check your connection.",
                "upload_error"
            )
        
        # Get ping
        try:
            ping = round(st.results.ping, 2)
        except Exception as e:
            logger.error(f"Ping test failed: {e}")
            raise SpeedTestError(
                "Latency test failed. Please check your connection.",
                "ping_error"
            )
        
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
        
    except SpeedTestError as e:
        logger.error(f"Speed test error: {e.message} (Type: {e.error_type})")
        return Response(
            {
                'error': e.message,
                'error_type': e.error_type
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        logger.error(f"Unexpected error in speed test: {e}")
        return Response(
            {
                'error': 'An unexpected error occurred during the speed test.',
                'error_type': 'unknown',
                'details': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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

@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return Response({
            'success': True,
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'is_subscriber': hasattr(request.user, 'subscriber')
            }
        })
    return Response({'success': False, 'message': 'Not authenticated'})

@api_view(['GET'])
def is_superuser(request):
    if request.user.is_authenticated:
        return Response({
            'success': True,
            'user': {
                'username': request.user.username,
                'is_superuser': request.user.is_superuser
            }
        })
    return Response({'success': False, 'message': 'Not authenticated'})

class NewsPostViewSet(viewsets.ModelViewSet):
    queryset = NewsPost.objects.all()
    serializer_class = NewsPostSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        if self.request.user.is_staff:
            return NewsPost.objects.all()
        return NewsPost.objects.filter(is_published=True)

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsPost.objects.filter(is_published=True)
    serializer_class = NewsPostSerializer
    permission_classes = [permissions.AllowAny]

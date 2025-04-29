from django.shortcuts import render
import nmap
import speedtest
from django.http import JsonResponse
from scapy.all import ARP, Ether, srp
import socket
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

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
            
    except Exception as e:
        logger.error(f"Error scanning network: {e}")
        return JsonResponse({
            'error': 'Network scan failed',
            'details': str(e)
        }, status=500)
        
    return JsonResponse({'devices': devices})

def speed_test(request):
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        
        download = round(st.download() / 1_000_000, 2)  # Convert to Mbps
        upload = round(st.upload() / 1_000_000, 2)
        ping = round(st.results.ping, 2)
        
        return JsonResponse({
            'speed_test': {
                'download': download,
                'upload': upload,
                'ping': ping
            }
        })
    except Exception as e:
        logger.error(f"Speed test failed: {e}")
        return JsonResponse({
            'error': 'Speed test failed',
            'details': str(e)
        }, status=500)

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

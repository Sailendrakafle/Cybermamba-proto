from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Subscriber, UserProfile, NetworkScan, SpeedTest

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['last_login_ip', 'last_network_scan', 'last_speed_test']

class CustomUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_subscriber', 'profile']
        read_only_fields = ['is_superuser', 'is_staff']

class NetworkScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkScan
        fields = ['timestamp', 'devices_found']
        read_only_fields = ['timestamp']

class SpeedTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeedTest
        fields = ['timestamp', 'download_speed', 'upload_speed', 'ping']
        read_only_fields = ['timestamp']

class SubscriberSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Subscriber
        fields = ['id', 'name', 'email', 'agreed_to_terms', 'created_at', 'user']
        read_only_fields = ['id', 'created_at', 'user']
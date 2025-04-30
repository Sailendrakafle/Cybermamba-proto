from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    is_subscriber = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-date_joined']

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    last_network_scan = models.DateTimeField(null=True, blank=True)
    last_speed_test = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"

class Subscriber(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='subscriber', null=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    agreed_to_terms = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.email})"

    class Meta:
        ordering = ['-created_at']

class NetworkScan(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='network_scans')
    timestamp = models.DateTimeField(auto_now_add=True)
    devices_found = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['-timestamp']

class SpeedTest(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='speed_tests')
    timestamp = models.DateTimeField(auto_now_add=True)
    download_speed = models.FloatField()
    upload_speed = models.FloatField()
    ping = models.FloatField()
    
    class Meta:
        ordering = ['-timestamp']

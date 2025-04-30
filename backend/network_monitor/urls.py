from django.urls import path
from . import views

urlpatterns = [
    path('scan/', views.scan_network, name='scan_network'),
    path('speed/', views.speed_test, name='speed_test'),
    path('stats/', views.network_stats, name='network_stats'),
    path('subscribe/', views.subscribe, name='subscribe'),
]
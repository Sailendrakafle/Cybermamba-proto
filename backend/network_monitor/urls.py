from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views
from .admin import admin_site

app_name = 'network_monitor'  # Add unique app namespace

urlpatterns = [
    path('dashboard/', views.UserDashboardView.as_view(), name='user-dashboard'),
    path('superroot/', admin_site.urls, name='superroot-admin'),
    path('scan/', views.scan_network, name='scan_network'),
    path('speed/', views.speed_test, name='speed_test'),
    path('stats/', views.network_stats, name='network_stats'),
    path('subscribe/', views.subscribe, name='subscribe'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', LogoutView.as_view(next_page='network_monitor:user-dashboard'), name='logout'),
    path('user/current/', views.current_user, name='current-user'),
    path('user/is-superuser/', views.is_superuser, name='is-superuser'),
]
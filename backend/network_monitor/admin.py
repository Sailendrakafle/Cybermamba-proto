from django.contrib import admin
from django.utils import timezone
from django.db.models import Count, Avg
from django.utils.html import format_html
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .models import Subscriber, NetworkScan, SpeedTest, UserProfile, CustomUser, NewsPost

User = get_user_model()

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_subscriber', 'is_superuser', 'date_joined')
    list_filter = ('is_subscriber', 'is_superuser', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')
    readonly_fields = ('date_joined', 'last_login')

    def get_queryset(self, request):
        # Only superusers can see other superusers
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            qs = qs.filter(is_superuser=False)
        return qs

    def has_change_permission(self, request, obj=None):
        # Only superusers can modify other superusers
        if obj and obj.is_superuser and not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj)

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'agreed_to_terms', 'created_at', 'subscription_status')
    search_fields = ('name', 'email')
    list_filter = ('agreed_to_terms', 'created_at')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25

    def subscription_status(self, obj):
        if obj.agreed_to_terms:
            return format_html('<span style="color: green;">Active</span>')
        return format_html('<span style="color: red;">Inactive</span>')
    subscription_status.short_description = 'Status'

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')

@admin.register(NetworkScan)
class NetworkScanAdmin(admin.ModelAdmin):
    list_display = ('user', 'timestamp', 'device_count')
    list_filter = ('timestamp', 'user')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)

    def device_count(self, obj):
        return len(obj.devices_found)
    device_count.short_description = 'Devices Found'

@admin.register(SpeedTest)
class SpeedTestAdmin(admin.ModelAdmin):
    list_display = ('user', 'timestamp', 'download_speed', 'upload_speed', 'ping')
    list_filter = ('timestamp', 'user')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'last_login_ip', 'last_network_scan', 'last_speed_test')
    list_filter = ('last_network_scan', 'last_speed_test')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('last_login_ip', 'last_network_scan', 'last_speed_test')

@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'publish_date', 'is_published', 'created_at')
    list_filter = ('is_published', 'publish_date')
    search_fields = ('title', 'summary', 'content')
    ordering = ('-publish_date',)
    date_hierarchy = 'publish_date'
    fields = ('title', 'summary', 'content', 'image', 'publish_date', 'is_published')

class NetworkMonitorAdminSite(admin.AdminSite):
    site_header = 'Network Monitor Administration'
    site_title = 'Network Monitor Admin'
    index_title = 'Superroot Dashboard'

    def has_permission(self, request):
        """
        Only allow superusers to access this admin site
        """
        return request.user.is_active and request.user.is_superuser

    @method_decorator(staff_member_required)
    def index(self, request, extra_context=None):
        if not request.user.is_superuser:
            raise PermissionDenied("Only superusers can access this dashboard.")
            
        try:
            # System statistics
            total_users = User.objects.count()
            total_subscribers = Subscriber.objects.count()
            active_subscribers = Subscriber.objects.filter(agreed_to_terms=True).count()
            
            # News statistics
            news_count = NewsPost.objects.count()
            published_news_count = NewsPost.objects.filter(is_published=True).count()
            recent_news = NewsPost.objects.all().order_by('-publish_date')[:10]

            # Today's statistics
            today = timezone.now().date()
            today_stats = {
                'new_users': User.objects.filter(date_joined__date=today).count(),
                'network_scans': NetworkScan.objects.filter(timestamp__date=today).count(),
                'speed_tests': SpeedTest.objects.filter(timestamp__date=today).count(),
            }

            context = {
                'title': 'Superroot Dashboard',
                'total_users': total_users,
                'total_subscribers': total_subscribers,
                'active_subscribers': active_subscribers,
                'news_count': news_count,
                'published_news_count': published_news_count,
                'recent_news': recent_news,
                'today_stats': today_stats,
                **(extra_context or {})
            }
            
            return super().index(request, context)
            
        except Exception as e:
            messages.error(request, f'Dashboard error: {str(e)}')
            return super().index(request, {'error': str(e)})

# Register models with the custom admin site
admin_site = NetworkMonitorAdminSite(name='networkmonitor')
admin_site.register(CustomUser, CustomUserAdmin)
admin_site.register(Subscriber, SubscriberAdmin)
admin_site.register(NetworkScan, NetworkScanAdmin)
admin_site.register(SpeedTest, SpeedTestAdmin)
admin_site.register(UserProfile, UserProfileAdmin)
admin_site.register(NewsPost, NewsPostAdmin)

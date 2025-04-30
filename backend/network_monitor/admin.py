from django.contrib import admin
from django.utils import timezone
from django.db.models import Count, Avg
from django.utils.html import format_html
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from .models import Subscriber
from .views import scan_network, speed_test

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

    def changelist_view(self, request, extra_context=None):
        # Get today's statistics
        today = timezone.now().date()
        today_stats = Subscriber.objects.filter(
            created_at__date=today
        ).aggregate(
            today_count=Count('id')
        )

        # Get total statistics
        total_stats = Subscriber.objects.aggregate(
            total_count=Count('id'),
            active_count=Count('id', filter={'agreed_to_terms': True})
        )

        # Create the summary dictionary
        summary_stats = {
            'Total Subscriptions': total_stats['total_count'],
            'Active Subscriptions': total_stats['active_count'],
            'New Today': today_stats['today_count'],
        }

        # Add the stats to the extra context
        extra_context = extra_context or {}
        extra_context['summary_stats'] = summary_stats

        return super().changelist_view(request, extra_context=extra_context)

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')

    # Custom admin template that includes the summary statistics
    change_list_template = 'admin/subscriber/change_list.html'

class DashboardView(admin.AdminSite):
    site_header = 'Network Monitor Administration'
    site_title = 'Network Monitor Admin'
    index_title = 'Dashboard'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(self.dashboard_view), name='admin-dashboard'),
        ]
        return custom_urls + urls

    def has_permission(self, request):
        """
        Check if the user has permission to access the admin site
        """
        return request.user.is_active and request.user.is_staff

    @method_decorator(staff_member_required)
    def dashboard_view(self, request):
        if not self.has_permission(request):
            raise PermissionDenied
        
        try:
            # Get subscriber statistics
            total_subscribers = Subscriber.objects.count()
            active_subscribers = Subscriber.objects.filter(agreed_to_terms=True).count()
            recent_subscribers = Subscriber.objects.order_by('-created_at')[:5]

            # Get network statistics with error handling
            try:
                network_response = scan_network(request)
                network_data = network_response.json() if network_response.status_code == 200 else {'devices': []}
                if network_response.status_code != 200:
                    messages.warning(request, 'Network scan encountered issues. Some data may be incomplete.')
            except Exception as e:
                network_data = {'devices': []}
                messages.error(request, f'Failed to scan network: {str(e)}')

            # Get speed test data with error handling
            try:
                speed_response = speed_test(request)
                speed_data = speed_response.json().get('speed_test', {}) if speed_response.status_code == 200 else {}
                if speed_response.status_code != 200:
                    messages.warning(request, 'Speed test encountered issues. Some data may be incomplete.')
            except Exception as e:
                speed_data = {}
                messages.error(request, f'Failed to perform speed test: {str(e)}')

            context = {
                'title': 'Network Monitor Dashboard',
                'total_subscribers': total_subscribers,
                'active_subscribers': active_subscribers,
                'recent_subscribers': recent_subscribers,
                'devices': network_data.get('devices', []),
                'speed_test': speed_data,
                'is_nav_sidebar_enabled': True,
                'available_apps': self.get_app_list(request),
                'has_permission': self.has_permission(request),
            }

            return render(request, 'admin/dashboard.html', context)
            
        except Exception as e:
            messages.error(request, f'Dashboard error: {str(e)}')
            context = {
                'title': 'Dashboard Error',
                'error': str(e),
                'is_nav_sidebar_enabled': True,
                'available_apps': self.get_app_list(request),
                'has_permission': self.has_permission(request),
            }
            return render(request, 'admin/dashboard.html', context)

# Register the custom admin site
admin_site = DashboardView()

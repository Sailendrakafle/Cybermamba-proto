from django.contrib import admin
from django.utils import timezone
from django.db.models import Count, Avg
from django.utils.html import format_html
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
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
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(self.dashboard_view), name='admin-dashboard'),
        ]
        return custom_urls + urls

    @staff_member_required
    def dashboard_view(self, request):
        # Get subscriber statistics
        total_subscribers = Subscriber.objects.count()
        active_subscribers = Subscriber.objects.filter(agreed_to_terms=True).count()
        recent_subscribers = Subscriber.objects.order_by('-created_at')[:5]

        # Get network statistics
        network_data = scan_network(request).json()
        speed_data = speed_test(request).json().get('speed_test', {})

        context = {
            'title': 'Network Monitor Dashboard',
            'total_subscribers': total_subscribers,
            'active_subscribers': active_subscribers,
            'recent_subscribers': recent_subscribers,
            'devices': network_data.get('devices', []),
            'speed_test': speed_data,
            'is_nav_sidebar_enabled': True,
            'available_apps': self.get_app_list(request),
        }

        return render(request, 'admin/dashboard.html', context)

# Register the custom admin site
admin_site = DashboardView()

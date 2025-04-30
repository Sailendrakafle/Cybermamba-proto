from django.contrib import admin
from .models import Subscriber

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'agreed_to_terms', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('agreed_to_terms', 'created_at')

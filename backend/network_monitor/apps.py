from django.apps import AppConfig


class NetworkMonitorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'network_monitor'

    def ready(self):
        from . import signals  # Register signals

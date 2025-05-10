# Settings initialization for EchoMon backend

import os
from pathlib import Path

__all__ = ['ENVIRONMENT']

# Determine which environment settings to load
ENVIRONMENT = os.environ.get('DJANGO_ENV', 'development')

# Import appropriate environment settings
if ENVIRONMENT == 'production':
    from .environments.production import *
else:
    from .environments.development import *

#!/bin/bash

# Wait for postgres to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL is up and running!"

# Run database migrations
echo "Running migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the Django application with gunicorn
echo "Starting server..."
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4

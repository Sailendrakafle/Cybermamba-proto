# Backend Dockerfile for EchoMon
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_ENV=production

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-traditional \
    speedtest-cli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy project
COPY . .

# Create static files directory
RUN mkdir -p /app/staticfiles

# Run as non-root user for better security
RUN useradd -m echomon
RUN chown -R echomon:echomon /app
USER echomon

# Run the entry point script
COPY ./docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

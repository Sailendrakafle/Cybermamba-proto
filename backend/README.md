# Cybermamba Network Monitor Backend

A powerful Django-based backend service for network monitoring and device management.

## Features

- Real-time network scanning and device discovery
- Network speed testing and performance metrics
- Subscriber management with admin dashboard
- RESTful API endpoints for frontend integration
- CORS support for secure cross-origin requests

## Prerequisites

- Python 3.10 or higher
- Django 5.2
- PostgreSQL (optional, SQLite by default)
- Network monitoring tools (nmap, speedtest-cli)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply database migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

## API Endpoints

- `GET /api/scan/`: Scan network for connected devices
- `GET /api/speed/`: Run network speed test
- `GET /api/stats/`: Get combined network statistics
- `POST /api/subscribe/`: Subscribe to network monitoring updates

## Development

Start the development server:
```bash
python manage.py runserver 5252
```

The server will be available at `http://localhost:5252`

## Admin Dashboard

Access the admin interface at `http://localhost:5252/admin` to:
- Manage subscribers
- View subscription statistics
- Monitor network devices
- Track system performance

## Environment Variables

Create a `.env` file in the backend directory with:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
NETWORK_RANGE=192.168.1.0/24  # Adjust to your network
```

## Testing

Run the test suite:
```bash
python manage.py test
```

## Security

- CSRF protection enabled
- CORS configuration for frontend access
- Session-based authentication for admin
- Email verification for subscribers
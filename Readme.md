# Cybermamba-proto

This is a prototype repository for the Cybermamba project.

## Description

Cybermamba is a comprehensive network monitoring solution that combines a Next.js frontend with a Django backend to provide real-time network device monitoring, speed testing, and performance metrics. The project aims to give users and administrators detailed insights into their network's health and performance through an intuitive interface.

## Features

- Real-time network device monitoring and discovery
- Network speed testing with historical data
- Interactive dashboard with dark/light theme support
- Subscriber management system
- Admin dashboard for network oversight
- RESTful API endpoints
- Responsive design for all devices
- Cyber news feed and updates
- Interactive cybersecurity quiz

## Getting Started

### Prerequisites

* Python 3.10 or higher
* Node.js 18 or higher
* npm or yarn
* Network monitoring tools (nmap, speedtest-cli)
* Git
* Docker and Docker Compose (for containerized deployment)

### Standard Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Cybermamba-proto.git
   cd Cybermamba-proto
   ```

2. Backend Setup:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   ```

3. Frontend Setup:
   ```bash
   cd ../frontend
   npm install
   # or
   yarn install
   ```

4. Environment Setup:
   
   Backend (.env):
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key
   ALLOWED_HOSTS=localhost,127.0.0.1
   NETWORK_RANGE=192.168.1.0/24
   ```

   Frontend (.env.local):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5252
   ```

### Docker Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Cybermamba-proto.git
   cd Cybermamba-proto
   ```

2. Build and run with Docker Compose:
   ```bash
   docker-compose build
   docker-compose up
   ```

3. Create a superuser for the Django admin:
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:5252/admin
   - API Documentation: http://localhost:5252/api/docs/

### Environment Variables for Docker

Docker Compose uses the following environment variables:

Backend:
- `DEBUG`: Set to False in production
- `SECRET_KEY`: Your Django secret key
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `NETWORK_RANGE`: Network range to scan (e.g. 172.18.0.0/16 in Docker)
- `DATABASE_URL`: PostgreSQL connection string

Frontend:
- `NEXT_PUBLIC_API_URL`: URL to the backend API

These variables are already configured in the docker-compose.yml file.

### Usage

1. Start the backend server:
   ```bash
   cd backend
   python manage.py runserver 5252
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   # or
   yarn dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:5252/admin
   - API Documentation: http://localhost:5252/api/docs/

## Project Structure

```
Cybermamba-proto/
├── backend/               # Django backend
│   ├── network_monitor/   # Main application
│   │   ├── admin.py       # Admin panel configuration
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API views and endpoints
│   │   ├── urls.py        # API routing
│   │   └── serializers.py # API data serialization
│   └── backend/           # Project settings
├── frontend/              # Next.js frontend
│   ├── src/               # Source code
│   │   ├── app/           # Pages and routes
│   │   ├── components/    # React components
│   │   └── services/      # API services
│   └── public/            # Static assets
```

## Key Features

### Network Monitoring
The system automatically discovers devices on your network and monitors their connectivity, providing real-time updates on device status.

### Speed Testing
Regular speed tests track your network performance over time, allowing you to identify trends and potential issues.

### Subscriber Management
Manage users who have access to monitoring capabilities with different permission levels.

### Cybersecurity News
Stay updated with the latest cybersecurity news and alerts directly in your dashboard.

## Technology Stack

- **Backend**: Django, Django REST Framework, SQLite (development) / PostgreSQL (production)
- **Frontend**: Next.js, TypeScript, TailwindCSS, shadcn/ui
- **Network Tools**: nmap, speedtest-cli
- **Authentication**: JWT tokens

## Docker Deployment

### Architecture

The Docker setup consists of three services:
1. **PostgreSQL Database**: Persistent storage for application data
2. **Django Backend**: API server with network monitoring capabilities
3. **Next.js Frontend**: User interface for the monitoring system

### Development with Docker

For development purposes, you can use:
```bash
docker-compose up
```

This will start all services with hot-reloading enabled for both frontend and backend.

### Production Deployment

For production, consider using:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

(Create a docker-compose.prod.yml with production-specific configurations)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Last Updated

May 6, 2025

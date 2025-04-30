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

## Getting Started

### Prerequisites

* Python 3.10 or higher
* Node.js 18 or higher
* npm or yarn
* Network monitoring tools (nmap, speedtest-cli)
* Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
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

## Project Structure

```
Cybermamba-proto/
├── backend/           # Django backend
│   ├── network_monitor/   # Main application
│   └── backend/          # Project settings
├── frontend/         # Next.js frontend
│   ├── src/             # Source code
│   │   ├── app/        # Pages and routes
│   │   ├── components/ # React components
│   │   └── services/   # API services
│   └── public/         # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

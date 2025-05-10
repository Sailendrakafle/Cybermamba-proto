# EchoMon Network Monitor Frontend

A modern, responsive Next.js frontend for the EchoMon Network Monitoring system.

## Features

- Real-time network device monitoring
- Interactive speed test visualization
- Dark/light theme support
- Responsive design for all devices
- SWR for real-time data updates
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Next.js 15.3

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5252
```

## Development

Start the development server with Turbopack:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/             # Next.js 13+ app directory
│   ├── components/      # Reusable React components
│   │   ├── ui/         # UI components (cards, buttons, etc.)
│   │   └── ...         # Feature-specific components
│   ├── lib/            # Utility functions
│   └── services/       # API services
├── public/             # Static assets
└── ...
```

## Key Components

- `NetworkDevices.tsx`: Real-time device monitoring
- `SpeedTest.tsx`: Network speed testing interface
- `Header.tsx`: Navigation and theme switching
- `Footer.tsx`: Site footer with links
- Various UI components for consistent styling

## Features in Detail

### Network Monitoring
- Real-time device discovery
- Connection status tracking
- Device details display

### Speed Testing
- Download/Upload speed measurement
- Historical data visualization
- Performance metrics

### User Interface
- Responsive design
- Dark/light theme
- Loading states
- Error handling

## Technologies

- Next.js 15.3
- React 18
- Tailwind CSS
- SWR for data fetching
- TypeScript
- Various UI libraries (tremor, lucide-react)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

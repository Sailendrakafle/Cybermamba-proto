/**
 * Network monitoring API client
 */
import { API_BASE_URL } from '../config';

interface NetworkDevice {
  ip: string;
  mac: string;
  hostname: string | null;
  last_seen: string;
  status: 'online' | 'offline';
  first_seen: string;
}

interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  timestamp: string;
  server: {
    host: string;
    name: string;
    location: string;
  };
}

interface SpeedTestStatus {
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
}

export const networkApi = {
  /**
   * Get all network devices
   */
  async getNetworkDevices() {
    const response = await fetch(`${API_BASE_URL}/api/network/devices/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch network devices: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Get latest speed test result
   */
  async getLatestSpeedTest(): Promise<SpeedTestResult | null> {
    const response = await fetch(`${API_BASE_URL}/api/network/speedtests/latest/`);
    if (response.status === 404) {
      return null; // No speed tests performed yet
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch latest speed test: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Get all speed test results
   */
  async getAllSpeedTests(): Promise<SpeedTestResult[]> {
    const response = await fetch(`${API_BASE_URL}/api/network/speedtests/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch speed tests: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Start a new speed test
   */
  async startSpeedTest() {
    const response = await fetch(`${API_BASE_URL}/api/network/speedtests/run/`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`Failed to start speed test: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Get speed test status
   */
  async getSpeedTestStatus(): Promise<SpeedTestStatus> {
    const response = await fetch(`${API_BASE_URL}/api/network/speedtests/status/`);
    if (!response.ok) {
      throw new Error(`Failed to get speed test status: ${response.status}`);
    }
    return response.json();
  }
}

import React, { useEffect, useState } from 'react';
import { networkApi } from '@/services/api';
import { RefreshIndicator } from '../layout/RefreshIndicator';
import { Card } from '../ui/card';
import { Table } from '../ui/table';

interface NetworkDevice {
  ip: string;
  mac: string;
  hostname: string;
  last_seen: string;
  status: 'online' | 'offline';
  first_seen: string;
}

interface NetworkDevicesResponse {
  devices: NetworkDevice[];
  timestamp: string;
}

export function NetworkDevices() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNetworkDevices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data: NetworkDevicesResponse = await networkApi.getNetworkDevices();
      
      setDevices(data.devices);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch network devices');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkDevices();
    
    // Set up polling every 60 seconds
    const intervalId = setInterval(() => {
      fetchNetworkDevices();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleRefresh = () => {
    fetchNetworkDevices();
  };
  
  return (
    <div>
      <div>
        <h3>Network Devices</h3>
        <RefreshIndicator 
          onRefresh={handleRefresh} 
          lastUpdated={lastUpdated} 
          isLoading={isLoading} 
        />
      </div>
      
      {error ? (
        <div>
          {error}
        </div>
      ) : (
        <div>
          <Table>
            <thead>
              <tr>
                <th>IP Address</th>
                <th>MAC Address</th>
                <th>Hostname</th>
                <th>Status</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !devices.length ? (
                <tr>
                  <td colSpan={5}>
                    Loading...
                  </td>
                </tr>
              ) : devices.length ? (
                devices.map((device) => (
                  <tr key={device.mac}>
                    <td>{device.ip}</td>
                    <td>{device.mac}</td>
                    <td>{device.hostname || 'Unknown'}</td>
                    <td>{device.status}</td>
                    <td>{new Date(device.last_seen).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    No devices found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

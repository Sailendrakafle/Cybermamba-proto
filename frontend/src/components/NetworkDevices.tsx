import React, { useEffect, useState } from 'react';
import { networkApi } from '@/services/api';
import { RefreshIndicator } from './RefreshIndicator';
import { Card } from './ui/card';
import { Table } from './ui/table';

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
      const response = await networkApi.getNetworkDevices();
      const data = response.data;
      
      setDevices(data.data.devices);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch network devices:", err);
      setError("Failed to fetch network devices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNetworkDevices();
  }, []);
  
  return (
    <div>
      <div>
        <h2>Network Devices</h2>
        <RefreshIndicator 
          lastUpdated={lastUpdated}
          onRefresh={fetchNetworkDevices}
          isLoading={isLoading}
        />
      </div>
      
      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}
      
      <div>
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>MAC</th>
              <th>Hostname</th>
              <th>Status</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : devices.length > 0 ? (
              devices.map((device, index) => (
                <tr key={index}>
                  <td>{device.ip}</td>
                  <td>{device.mac}</td>
                  <td>{device.hostname || 'Unknown'}</td>
                  <td>
                    {device.status}
                  </td>
                  <td>
                    {new Date(device.last_seen).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No devices found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
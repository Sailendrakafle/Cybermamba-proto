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
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Network Devices</h2>
        <RefreshIndicator 
          lastUpdated={lastUpdated}
          onRefresh={fetchNetworkDevices}
          isLoading={isLoading}
        />
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="overflow-auto">
        <Table>
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">IP</th>
              <th className="px-4 py-2 text-left">MAC</th>
              <th className="px-4 py-2 text-left">Hostname</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">Loading...</td>
              </tr>
            ) : devices.length > 0 ? (
              devices.map((device, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">{device.ip}</td>
                  <td className="px-4 py-2">{device.mac}</td>
                  <td className="px-4 py-2">{device.hostname || 'Unknown'}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block w-2 h-2 mr-2 rounded-full ${
                      device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                    {device.status}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(device.last_seen).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">No devices found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
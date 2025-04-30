import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';
import useSWR from 'swr';
import { networkApi } from '../services/api';
import { RefreshIndicator } from './RefreshIndicator';
import { useState } from 'react';

interface Device {
  ip: string;
  mac: string;
  hostname: string;
}

export function NetworkDevices() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { data, error, isLoading, mutate } = useSWR('/scan', networkApi.scanNetwork);
  
  const handleRefresh = async () => {
    await mutate();
    setLastUpdated(new Date());
  };

  if (error) return <div>Failed to load devices</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Connected Devices</Title>
        <RefreshIndicator lastUpdated={lastUpdated} onRefresh={handleRefresh} />
      </div>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Hostname</TableHeaderCell>
            <TableHeaderCell>IP Address</TableHeaderCell>
            <TableHeaderCell>MAC Address</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.devices?.map((device: Device) => (
            <TableRow key={device.mac}>
              <TableCell>{device.hostname}</TableCell>
              <TableCell>{device.ip}</TableCell>
              <TableCell>{device.mac}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
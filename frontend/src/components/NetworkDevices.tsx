import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
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

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load devices. Please try again later.</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
  
  if (isLoading) return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Connected Devices</CardTitle>
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const devices = data?.data?.devices || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Connected Devices</CardTitle>
        <RefreshIndicator lastUpdated={lastUpdated} onRefresh={handleRefresh} />
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <Alert>
            <AlertDescription>No devices found on the network.</AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hostname</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>MAC Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device: Device) => (
                <TableRow key={device.mac}>
                  <TableCell>{device.hostname}</TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell className="font-mono">{device.mac}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock } from "lucide-react";
import useSWR from 'swr';
import { networkApi } from '../services/api';
import { RefreshIndicator } from './RefreshIndicator';
import { AxiosResponse } from 'axios';
import { SWR_CONFIGS } from '@/lib/utils';

interface NetworkDevice {
  ip: string;
  mac: string;
  hostname: string;
  last_seen: string;
  status: 'online' | 'offline';
  first_seen: string;
}

interface NetworkDevicesData {
  devices: NetworkDevice[];
  timestamp: string;
}

interface NetworkResponse<T> {
  data: T;
}

interface NetworkDevicesProps {
  permissionsGranted: boolean;
}

export function NetworkDevices({ permissionsGranted }: NetworkDevicesProps) {
  const { data, error, isLoading, mutate } = useSWR<NetworkResponse<NetworkDevicesData>>(
    permissionsGranted ? '/api/network/devices' : null,
    async (url: string) => {
      const response = await networkApi.getNetworkDevices();
      return response.data;
    },
    SWR_CONFIGS.networkDevices
  );

  const handleRefresh = () => {
    mutate();
  };

  const lastUpdated = data?.data?.timestamp ? new Date(data.data.timestamp) : null;

  if (!permissionsGranted) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Network Devices</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please grant network access permissions to view connected devices.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Network Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load network devices. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Network Devices</CardTitle>
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>Loading network devices...</AlertDescription>
            </Alert>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hostname</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>MAC Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  const devices: NetworkDevice[] = data?.data?.devices || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Network Devices</CardTitle>
        <RefreshIndicator 
          lastUpdated={lastUpdated} 
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <Alert>
            <AlertDescription>
              No devices found on your network.
            </AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hostname</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.mac} className={device.status === 'offline' ? 'opacity-60' : ''}>
                  <TableCell className="font-medium">
                    {device.hostname || 'Unknown Device'}
                    <div className="text-xs text-muted-foreground">
                      First seen: {new Date(device.first_seen).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{device.mac}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      device.status === 'online' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {device.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
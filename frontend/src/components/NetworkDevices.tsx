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

interface NetworkDevice {
  ip: string;
  mac: string;
  hostname: string;
  last_seen: string;
}

interface NetworkDevicesProps {
  permissionsGranted: boolean;
}

export function NetworkDevices({ permissionsGranted }: NetworkDevicesProps) {
  const { data, error, isLoading, mutate } = useSWR(
    permissionsGranted ? '/api/network/devices' : null,
    networkApi.getNetworkDevices
  );

  const handleRefresh = () => {
    mutate();
  };

  const lastUpdated = data?.timestamp ? new Date(data.timestamp) : null;

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.mac}>
                  <TableCell className="font-medium">{device.hostname || 'Unknown Device'}</TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{device.mac}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
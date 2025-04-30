import { Card, Title, Grid, Metric, Text } from '@tremor/react';
import useSWR from 'swr';
import { networkApi } from '../services/api';
import { RefreshIndicator } from './RefreshIndicator';
import { useState } from 'react';

interface SpeedTestData {
  download: number;
  upload: number;
  ping: number;
}

export function SpeedTest() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { data, error, isLoading, mutate } = useSWR('/speed', networkApi.getSpeedTest);
  
  const handleRefresh = async () => {
    await mutate();
    setLastUpdated(new Date());
  };

  if (error) return <div>Failed to load speed test</div>;
  if (isLoading) return <div>Loading...</div>;

  const speedData: SpeedTestData = data?.speed_test;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Network Speed</Title>
        <RefreshIndicator lastUpdated={lastUpdated} onRefresh={handleRefresh} />
      </div>
      <Grid numItems={3} className="gap-4 mt-4">
        <div>
          <Text>Download</Text>
          <Metric>{speedData?.download} Mbps</Metric>
        </div>
        <div>
          <Text>Upload</Text>
          <Metric>{speedData?.upload} Mbps</Metric>
        </div>
        <div>
          <Text>Ping</Text>
          <Metric>{speedData?.ping} ms</Metric>
        </div>
      </Grid>
    </Card>
  );
}
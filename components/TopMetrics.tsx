'use client';

import { useEffect, useState } from 'react';
import { getTopMetrics, getHumanEngagementStats } from '@/lib/queries';

export function TopMetrics() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ [key: string]: number } | null>(null);
  const [engagementStats, setEngagementStats] = useState<{
    total_count: number;
    engaged_count: number;
  } | null>(null);

  // Static date range for now
  const startDate = '2024-01-01';
  const endDate = '2024-12-31';

  useEffect(() => {
    // For now, hardcode a client ID for demo purposes
    const hardcodedClientId = 'demo-client-id';
    setSelectedClientId(hardcodedClientId);
  }, []);

  useEffect(() => {
    async function fetchMetrics() {
      if (!selectedClientId) return;

      const topMetrics = await getTopMetrics(selectedClientId, startDate, endDate);
      const engagement = await getHumanEngagementStats(selectedClientId, startDate, endDate);
      setMetrics(topMetrics);
      setEngagementStats(engagement);
    }

    fetchMetrics();
  }, [selectedClientId]);

  return (
    <div>
      <h2>Top Metrics</h2>
      {metrics && (
        <ul>
          {Object.entries(metrics).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      )}
      {engagementStats && (
        <div>
          <p>Total: {engagementStats.total_count}</p>
          <p>Engaged: {engagementStats.engaged_count}</p>
        </div>
      )}
    </div>
  );
}

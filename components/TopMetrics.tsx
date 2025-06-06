'use client';

import { useEffect, useState } from 'react';
import { getClients, getTopMetrics, getHumanEngagementStats } from '@/lib/queries';

interface Client {
  client_id: string;
  name: string;
}

export function TopMetrics() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-12-31');
  const [metrics, setMetrics] = useState<{ [key: string]: number } | null>(null);
  const [engagementStats, setEngagementStats] = useState<{
    total_count: number;
    engaged_count: number;
  } | null>(null);

  useEffect(() => {
    async function loadClients() {
      const data = await getClients();
      setClients(data);
      if (data.length > 0) {
        setSelectedClientId(data[0].client_id);
      }
    }

    loadClients();
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
  }, [selectedClientId, startDate, endDate]);

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

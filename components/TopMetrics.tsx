// components/TopMetrics.tsx
'use client';

import { useEffect, useState } from 'react';
import { getClients, getTopMetrics, getHumanEngagementStats } from '@/lib/queries';
import { getSPC } from '@/lib/spc';

interface Client {
  client_id: string;
  name: string;
  ppc_sources: string[];
  lsa_sources: string[];
  seo_sources: string[];
}

interface Metrics {
  qualified_leads: number;
  qualified_leads_ppc: number;
  qualified_leads_lsa: number;
  qualified_leads_seo: number;
  spend_ppc: number;
  spend_lsa: number;
  spend_seo: number;
  spend_total: number;
  cpql_ppc: number;
  cpql_lsa: number;
  cpql_seo: number;
  cpql_total: number;
}

export default function TopMetrics({ startDate, endDate }: { startDate: string; endDate: string }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [data, setData] = useState<Record<string, Metrics & { human_engaged: number; total: number }>>({});

  useEffect(() => {
    async function load() {
      const clientList = await getClients();
      setClients(clientList);

      const all: Record<string, Metrics & { human_engaged: number; total: number }> = {};
      for (const c of clientList) {
        const [metrics, human] = await Promise.all([
          getTopMetrics(c.client_id, startDate, endDate),
          getHumanEngagementStats(c.client_id, startDate, endDate)
        ]);

        all[c.client_id] = {
          ...metrics,
          human_engaged: human?.engaged_count || 0,
          total: human?.total_count || 0
        };
      }

      setData(all);
    }

    load();
  }, [startDate, endDate]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {clients.map((client) => {
        const d = data[client.client_id];
        if (!d) return null;

        return (
          <div key={client.client_id} className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-2">{client.name}</h2>
            <ul className="text-sm space-y-1">
              <li><strong>Qualified Leads:</strong> {d.qualified_leads}</li>
              <li><strong>CPQL (Total):</strong> ${d.cpql_total.toFixed(2)}</li>
              <li><strong>Spend (Total):</strong> ${d.spend_total.toFixed(2)}</li>
              <li><strong>Human Engaged:</strong> {d.human_engaged} / {d.total}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}

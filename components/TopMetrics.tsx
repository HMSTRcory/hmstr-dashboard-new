"use client";

import { useEffect, useState } from "react";
import { getClients, getTopMetrics, getHumanEngagementStats } from "../lib/queries";

interface Client {
  client_id: string;
  client_name: string;
}

export function TopMetrics() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [metrics, setMetrics] = useState<any>(null);
  const [engagement, setEngagement] = useState<any>(null);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  useEffect(() => {
    if (!selectedClient) return;

    getTopMetrics(selectedClient, "2024-01-01", "2024-12-31").then(setMetrics);
    getHumanEngagementStats(selectedClient, "2024-01-01", "2024-12-31").then(setEngagement);
  }, [selectedClient]);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Top Metrics</h2>

      <select
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">Select a client</option>
        {clients.map((client) => (
          <option key={client.client_id} value={client.client_id}>
            {client.client_name}
          </option>
        ))}
      </select>

      {metrics && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Qualified Leads:</strong> {metrics.qualified_leads}
          </div>
          <div>
            <strong>Spend PPC:</strong> ${metrics.spend_ppc.toFixed(2)}
          </div>
          <div>
            <strong>CPQL PPC:</strong> ${metrics.cpql_ppc.toFixed(2)}
          </div>
          <div>
            <strong>CPQL LSA:</strong> ${metrics.cpql_lsa.toFixed(2)}
          </div>
          <div>
            <strong>CPQL SEO:</strong> ${metrics.cpql_seo.toFixed(2)}
          </div>
        </div>
      )}

      {engagement && (
        <div className="mt-4">
          <strong>Human Engagement:</strong> {engagement.engaged_count} / {engagement.total_count}
        </div>
      )}
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react'
import { getClients, getTopMetrics, getHumanEngagementStats } from '@/lib/queries'

interface Metrics {
  qualified_leads: number
  qualified_leads_ppc: number
  qualified_leads_lsa: number
  qualified_leads_seo: number
  spend_ppc: number
  spend_lsa: number
  spend_seo: number
  spend_total: number
  cpql_ppc: number
  cpql_lsa: number
  cpql_seo: number
  cpql_total: number
  avg_lead_score?: number
  avg_sales_score?: number
  avg_lead_score_ppc?: number
  avg_sales_score_ppc?: number
  avg_lead_score_lsa?: number
  avg_sales_score_lsa?: number
  avg_lead_score_seo?: number
  avg_sales_score_seo?: number
}

interface Client {
  client_id: string
  name: string
}

interface Props {
  clientId: string
  startDate: string
  endDate: string
}

export default function TopMetrics({ clientId, startDate, endDate }: Props) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [humanStats, setHumanStats] = useState<{ total_count: number; engaged_count: number } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [metrics, clients, human] = await Promise.all([
        getTopMetrics(clientId, startDate, endDate),
        getClients(),
        getHumanEngagementStats(clientId, startDate, endDate),
      ])
      setMetrics(metrics)
      setClients(clients)
      setHumanStats(human)
    }

    fetchData()
  }, [clientId, startDate, endDate])

  const clientName = clients.find(c => c.client_id === clientId)?.name || 'Client'

  if (!metrics) return null

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
        Showing data from <strong>{startDate}</strong> to <strong>{endDate}</strong>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <div className="text-muted-foreground">All QLeads</div>
          <div className="text-lg font-semibold">{metrics.qualified_leads}</div>
        </div>
        <div>
          <div className="text-muted-foreground">PPC QLeads</div>
          <div className="text-lg font-semibold">{metrics.qualified_leads_ppc}</div>
        </div>
        <div>
          <div className="text-muted-foreground">LSA QLeads</div>
          <div className="text-lg font-semibold">{metrics.qualified_leads_lsa}</div>
        </div>
        <div>
          <div className="text-muted-foreground">SEO QLeads</div>
          <div className="text-lg font-semibold">{metrics.qualified_leads_seo}</div>
        </div>

        <div>
          <div className="text-muted-foreground">Total Cost (All)</div>
          <div className="text-lg font-semibold">${metrics.spend_total.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Total Cost (PPC)</div>
          <div className="text-lg font-semibold">${metrics.spend_ppc.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Total Cost (LSA)</div>
          <div className="text-lg font-semibold">${metrics.spend_lsa.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Total Cost (SEO)</div>
          <div className="text-lg font-semibold">${metrics.spend_seo.toFixed(2)}</div>
        </div>

        <div>
          <div className="text-muted-foreground">Cost/QL (ALL)</div>
          <div className="text-lg font-semibold">${metrics.cpql_total.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Cost/QL (PPC)</div>
          <div className="text-lg font-semibold">${metrics.cpql_ppc.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Cost/QL (LSA)</div>
          <div className="text-lg font-semibold">${metrics.cpql_lsa.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Cost/QL (SEO)</div>
          <div className="text-lg font-semibold">${metrics.cpql_seo.toFixed(2)}</div>
        </div>

        <div>
          <div className="text-muted-foreground">Avg Lead Score (ALL)</div>
          <div className="text-lg font-semibold">{metrics.avg_lead_score?.toFixed(1) || '0.0'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Avg Sales Score (ALL)</div>
          <div className="text-lg font-semibold">{metrics.avg_sales_score?.toFixed(1) || '0.0'}</div>
        </div>

        <div>
          <div className="text-muted-foreground">Avg PPC Lead Score</div>
          <div className="text-lg font-semibold">{metrics.avg_lead_score_ppc?.toFixed(1) || '0.0'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Avg PPC Sales Score</div>
          <div className="text-lg font-semibold">{metrics.avg_sales_score_ppc?.toFixed(1) || '0.0'}</div>
        </div>

        <div>
          <div className="text-muted-foreground">Avg LSA Lead Score</div>
          <div className="text-lg font-semibold">{metrics.avg_lead_score_lsa?.toFixed(1) || '0.0'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Avg LSA Sales Score</div>
          <div className="text-lg font-semibold">{metrics.avg_sales_score_lsa?.toFixed(1) || '0.0'}</div>
        </div>

        <div>
          <div className="text-muted-foreground">Avg SEO Lead Score</div>
          <div className="text-lg font-semibold">{metrics.avg_lead_score_seo?.toFixed(1) || '0.0'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Avg SEO Sales Score</div>
          <div className="text-lg font-semibold">{metrics.avg_sales_score_seo?.toFixed(1) || '0.0'}</div>
        </div>

        {humanStats && (
          <>
            <div>
              <div className="text-muted-foreground">AI Human Engaged</div>
              <div className="text-lg font-semibold">
                {humanStats.engaged_count}/{humanStats.total_count}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

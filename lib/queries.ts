// lib/queries.ts
import { supabase } from '@/lib/supabaseClient';

export async function getClients() {
  const { data, error } = await supabase
    .from('clients_ffs')
    .select('client_id, name, ppc_sources, lsa_sources, seo_sources')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getTopMetrics(clientId: string, start: string, end: string) {
  const { data, error } = await supabase.rpc('get_top_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  });

  if (error) throw error;
  return data?.[0] || null;
}

export async function getCostLineChartMetrics(clientId: string, start: string, end: string, groupBy: string) {
  const { data, error } = await supabase.rpc('get_cost_line_chart_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
    input_group_by: groupBy,
  });

  if (error) throw error;
  return data || [];
}

export async function getHumanEngagementStats(clientId: string, start: string, end: string) {
  const { data, error } = await supabase.rpc('get_human_engagement_stats', {
    in_client_id: clientId,
    in_start: start,
    in_end: end,
  });

  if (error) throw error;
  return data?.[0] || null;
}

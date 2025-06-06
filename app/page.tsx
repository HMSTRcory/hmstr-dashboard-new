// app/page.tsx
'use client';

import { useState } from 'react';
import DashboardFilters from '@/components/DashboardFilters';
import TopMetrics from '@/components/TopMetrics';
import { addDays, format } from 'date-fns';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const start = format(dateRange.from, 'yyyy-MM-dd');
  const end = format(dateRange.to, 'yyyy-MM-dd');

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">HMSTR Dashboard</h1>
      <DashboardFilters dateRange={dateRange} setDateRange={setDateRange} />
      <TopMetrics startDate={start} endDate={end} />
    </main>
  );
}

import React from 'react';
import StatCards from '@/components/stat-cards';
import { UsageGraph } from '@/components/usage-graph';
import IncentivePools from '@/components/incentive-pools';
import Providers from '@/components/providers';
import Chains from '@/components/chains';

export default function DashboardContent() {
  return (
    <>
      <StatCards />
      <UsageGraph />
      <IncentivePools />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <Providers />
        <Chains />
      </div>
    </>
  );
}

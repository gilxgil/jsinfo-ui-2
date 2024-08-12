"use client";

import ProviderPage from '@/components/provider-page';

export default function Page({ params }: { params: { address: string } }) {
  return <ProviderPage address={params.address} />;
}
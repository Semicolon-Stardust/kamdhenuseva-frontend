'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

type ProvidersProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Providers({
  children,
  className = '',
}: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={className}>{children}</div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

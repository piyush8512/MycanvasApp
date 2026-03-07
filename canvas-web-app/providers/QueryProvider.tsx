"use client";

// ============================================================
// React Query Provider
// ============================================================

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create a new QueryClient instance for each session
  // This prevents data from being shared between users
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time - how long data is considered fresh
            staleTime: 60 * 1000, // 60 seconds
            // Cache time - how long inactive data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes
            // Retry failed requests
            retry: 1,
            // Avoid noisy refetches when users tab between windows.
            refetchOnWindowFocus: false,
            // Keep mount behavior cheap unless query is stale.
            refetchOnMount: false,
            // Recover after network drops.
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}

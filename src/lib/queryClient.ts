import { QueryClient } from '@tanstack/react-query'

/** Shared defaults: avoid refetch-on-remount churn; tune per-query if needed. */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // fresh for 5m — navigation won’t refetch Firestore constantly
            gcTime: 1000 * 60 * 10, // unused cache kept 10m
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        },
        mutations: {
            retry: 1,
        },
    },
})
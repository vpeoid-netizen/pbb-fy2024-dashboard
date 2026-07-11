"use client";

import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";
import { getInitialDashboardData } from "@/lib/initial-dashboard-data";
import type { ConnectionStatus, DashboardData } from "@/types/pbb";

const fetcher = async (url: string): Promise<DashboardData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
};

export function useDashboard() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("Live");
  const [isOnline, setIsOnline] = useState(true);

  const { data, error, isLoading, isValidating, mutate } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher,
    {
      fallbackData: getInitialDashboardData(),
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: () => setConnectionStatus("Synchronization Error"),
      onSuccess: () => {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          setConnectionStatus("Offline");
        } else {
          setConnectionStatus("Live");
        }
      },
    },
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionStatus("Reconnecting");
      void mutate().then(() => setConnectionStatus("Live"));
    };
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus("Offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [mutate]);

  useEffect(() => {
    if (isValidating && isOnline) {
      setConnectionStatus("Updating");
    } else if (!error && isOnline) {
      setConnectionStatus("Live");
    }
  }, [isValidating, error, isOnline]);

  const refresh = useCallback(async () => {
    setConnectionStatus("Updating");
    await mutate();
    setConnectionStatus(isOnline ? "Live" : "Offline");
  }, [mutate, isOnline]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    connectionStatus,
    isOnline,
    refresh,
    mutate,
  };
}

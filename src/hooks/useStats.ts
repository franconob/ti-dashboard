import { useState, useEffect } from 'react';
import { fetchStats } from '../api/client';
import type { Stats } from '../types/stats';

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetchStats(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { stats, loading };
}

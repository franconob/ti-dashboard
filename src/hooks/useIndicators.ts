import { useEffect, useRef } from 'react';
import { fetchIndicators } from '../api/client';
import { useDashboardState, useDashboardDispatch } from './useDashboard';

export function useIndicators() {
  const { search, severity, type, source, page } = useDashboardState();
  const dispatch = useDashboardDispatch();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'SET_LOADING', payload: true });

    fetchIndicators(
      {
        search: search || undefined,
        severity: severity || undefined,
        type: type || undefined,
        source: source || undefined,
        page,
        limit: 20,
      },
      controller.signal,
    )
      .then((res) => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'SET_INDICATORS', payload: res });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Failed to fetch indicators';
        if (!controller.signal.aborted) {
          dispatch({ type: 'SET_ERROR', payload: message });
        }
      });

    return () => controller.abort();
  }, [search, severity, type, source, page, dispatch]);
}

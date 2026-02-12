import { useEffect, useRef } from 'react';
import { fetchIndicatorById } from '../api/client';
import { useDashboardState, useDashboardDispatch } from './useDashboard';

export function useIndicatorDetail() {
  const { selectedId } = useDashboardState();
  const dispatch = useDashboardDispatch();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();

    if (!selectedId) {
      dispatch({ type: 'SET_SELECTED_DETAIL', payload: null });
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    fetchIndicatorById(selectedId, controller.signal)
      .then((indicator) => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'SET_SELECTED_DETAIL', payload: indicator });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          dispatch({ type: 'SET_SELECTED_DETAIL', payload: null });
        }
      });

    return () => controller.abort();
  }, [selectedId, dispatch]);
}

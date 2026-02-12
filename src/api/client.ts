import type { Indicator, IndicatorFilters, PaginatedResponse } from '../types/indicator';
import type { Stats } from '../types/stats';

const BASE_URL = '/api';

async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function fetchIndicators(
  filters: IndicatorFilters = {},
  signal?: AbortSignal,
): Promise<PaginatedResponse<Indicator>> {
  const params = new URLSearchParams();

  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.severity) params.set('severity', filters.severity);
  if (filters.type) params.set('type', filters.type);
  if (filters.search) params.set('search', filters.search);
  if (filters.source) params.set('source', filters.source);

  const qs = params.toString();
  return fetchJSON<PaginatedResponse<Indicator>>(
    `${BASE_URL}/indicators${qs ? `?${qs}` : ''}`,
    signal,
  );
}

export function fetchIndicatorById(
  id: string,
  signal?: AbortSignal,
): Promise<Indicator> {
  return fetchJSON<Indicator>(`${BASE_URL}/indicators/${id}`, signal);
}

export function fetchStats(signal?: AbortSignal): Promise<Stats> {
  return fetchJSON<Stats>(`${BASE_URL}/stats`, signal);
}

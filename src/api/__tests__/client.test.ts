import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchIndicators, fetchIndicatorById, fetchStats } from '../client';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
  });
}

describe('fetchIndicators', () => {
  it('calls /api/indicators with no params by default', async () => {
    const payload = { data: [], total: 0, page: 1, totalPages: 0 };
    mockFetch.mockReturnValue(jsonResponse(payload));

    const result = await fetchIndicators();
    expect(mockFetch).toHaveBeenCalledWith('/api/indicators', { signal: undefined });
    expect(result).toEqual(payload);
  });

  it('builds query string from filters', async () => {
    mockFetch.mockReturnValue(jsonResponse({ data: [], total: 0, page: 1, totalPages: 0 }));

    await fetchIndicators({ search: 'test', severity: 'high', type: 'ip', source: 'Shodan', page: 2, limit: 10 });

    const url = mockFetch.mock.calls[0]![0] as string;
    expect(url).toContain('search=test');
    expect(url).toContain('severity=high');
    expect(url).toContain('type=ip');
    expect(url).toContain('source=Shodan');
    expect(url).toContain('page=2');
    expect(url).toContain('limit=10');
  });

  it('throws on non-OK response', async () => {
    mockFetch.mockReturnValue(jsonResponse({}, 500));

    await expect(fetchIndicators()).rejects.toThrow('API error: 500');
  });

  it('passes AbortSignal to fetch', async () => {
    mockFetch.mockReturnValue(jsonResponse({ data: [], total: 0, page: 1, totalPages: 0 }));
    const controller = new AbortController();

    await fetchIndicators({}, controller.signal);
    expect(mockFetch.mock.calls[0]![1]).toEqual({ signal: controller.signal });
  });
});

describe('fetchIndicatorById', () => {
  it('calls /api/indicators/:id', async () => {
    const indicator = { id: 'abc', value: '1.2.3.4' };
    mockFetch.mockReturnValue(jsonResponse(indicator));

    const result = await fetchIndicatorById('abc');
    expect(mockFetch).toHaveBeenCalledWith('/api/indicators/abc', { signal: undefined });
    expect(result).toEqual(indicator);
  });
});

describe('fetchStats', () => {
  it('calls /api/stats', async () => {
    const stats = { total: 500, critical: 60, high: 140, medium: 200, low: 100 };
    mockFetch.mockReturnValue(jsonResponse(stats));

    const result = await fetchStats();
    expect(mockFetch).toHaveBeenCalledWith('/api/stats', { signal: undefined });
    expect(result).toEqual(stats);
  });
});

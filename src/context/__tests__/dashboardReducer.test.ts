import { describe, it, expect } from 'vitest';
import { dashboardReducer, initialState } from '../dashboardReducer';
import type { DashboardState, DashboardAction } from '../dashboardReducer';

describe('dashboardReducer', () => {
  it('returns initial state for unknown action', () => {
    const result = dashboardReducer(initialState, { type: 'UNKNOWN' } as unknown as DashboardAction);
    expect(result).toBe(initialState);
  });

  describe('filters', () => {
    it('SET_SEARCH updates search and resets page to 1', () => {
      const state: DashboardState = { ...initialState, page: 3 };
      const result = dashboardReducer(state, { type: 'SET_SEARCH', payload: 'malware' });
      expect(result.search).toBe('malware');
      expect(result.page).toBe(1);
    });

    it('SET_SEVERITY updates severity and resets page', () => {
      const state: DashboardState = { ...initialState, page: 5 };
      const result = dashboardReducer(state, { type: 'SET_SEVERITY', payload: 'critical' });
      expect(result.severity).toBe('critical');
      expect(result.page).toBe(1);
    });

    it('SET_TYPE updates type and resets page', () => {
      const state: DashboardState = { ...initialState, page: 2 };
      const result = dashboardReducer(state, { type: 'SET_TYPE', payload: 'ip' });
      expect(result.type).toBe('ip');
      expect(result.page).toBe(1);
    });

    it('SET_SOURCE updates source and resets page', () => {
      const state: DashboardState = { ...initialState, page: 4 };
      const result = dashboardReducer(state, { type: 'SET_SOURCE', payload: 'VirusTotal' });
      expect(result.source).toBe('VirusTotal');
      expect(result.page).toBe(1);
    });

    it('CLEAR_FILTERS resets all filters and page', () => {
      const state: DashboardState = {
        ...initialState,
        search: 'test',
        severity: 'high',
        type: 'domain',
        source: 'Shodan',
        page: 7,
      };
      const result = dashboardReducer(state, { type: 'CLEAR_FILTERS' });
      expect(result.search).toBe('');
      expect(result.severity).toBe('');
      expect(result.type).toBe('');
      expect(result.source).toBe('');
      expect(result.page).toBe(1);
    });
  });

  describe('pagination', () => {
    it('SET_PAGE updates page without resetting filters', () => {
      const state: DashboardState = { ...initialState, search: 'test', severity: 'high' };
      const result = dashboardReducer(state, { type: 'SET_PAGE', payload: 3 });
      expect(result.page).toBe(3);
      expect(result.search).toBe('test');
      expect(result.severity).toBe('high');
    });
  });

  describe('sorting', () => {
    it('SET_SORT sets field and defaults to desc', () => {
      const result = dashboardReducer(initialState, { type: 'SET_SORT', payload: 'value' });
      expect(result.sortField).toBe('value');
      expect(result.sortDirection).toBe('desc');
    });

    it('SET_SORT toggles direction when same field', () => {
      const state: DashboardState = { ...initialState, sortField: 'value', sortDirection: 'desc' };
      const result = dashboardReducer(state, { type: 'SET_SORT', payload: 'value' });
      expect(result.sortField).toBe('value');
      expect(result.sortDirection).toBe('asc');
    });

    it('SET_SORT resets to desc when changing field', () => {
      const state: DashboardState = { ...initialState, sortField: 'value', sortDirection: 'asc' };
      const result = dashboardReducer(state, { type: 'SET_SORT', payload: 'severity' });
      expect(result.sortField).toBe('severity');
      expect(result.sortDirection).toBe('desc');
    });
  });

  describe('data loading', () => {
    it('SET_LOADING updates loading state', () => {
      const result = dashboardReducer(initialState, { type: 'SET_LOADING', payload: true });
      expect(result.loading).toBe(true);
    });

    it('SET_INDICATORS sets data, total, totalPages and clears loading/error', () => {
      const state: DashboardState = { ...initialState, loading: true, error: 'prev error' };
      const payload = {
        data: [{ id: '1', value: '1.2.3.4' }] as DashboardState['indicators'],
        total: 100,
        totalPages: 5,
        page: 1,
      };
      const result = dashboardReducer(state, { type: 'SET_INDICATORS', payload });
      expect(result.indicators).toEqual(payload.data);
      expect(result.total).toBe(100);
      expect(result.totalPages).toBe(5);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('SET_ERROR sets error and clears loading', () => {
      const state: DashboardState = { ...initialState, loading: true };
      const result = dashboardReducer(state, { type: 'SET_ERROR', payload: 'Network error' });
      expect(result.error).toBe('Network error');
      expect(result.loading).toBe(false);
    });
  });

  describe('selection', () => {
    it('SELECT_INDICATOR sets selectedId', () => {
      const result = dashboardReducer(initialState, { type: 'SELECT_INDICATOR', payload: 'abc-123' });
      expect(result.selectedId).toBe('abc-123');
    });

    it('SELECT_INDICATOR with null clears selection and selectedIndicator', () => {
      const state: DashboardState = {
        ...initialState,
        selectedId: 'abc',
        selectedIndicator: { id: 'abc' } as DashboardState['selectedIndicator'],
      };
      const result = dashboardReducer(state, { type: 'SELECT_INDICATOR', payload: null });
      expect(result.selectedId).toBeNull();
      expect(result.selectedIndicator).toBeNull();
    });

    it('SET_SELECTED_DETAIL sets the indicator detail', () => {
      const indicator = { id: 'x', value: '1.2.3.4' } as DashboardState['selectedIndicator'];
      const result = dashboardReducer(initialState, { type: 'SET_SELECTED_DETAIL', payload: indicator });
      expect(result.selectedIndicator).toBe(indicator);
    });
  });
});

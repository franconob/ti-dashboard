import type { Indicator, IndicatorType, Severity } from '../types/indicator';

/* ─── Sort ─── */
export type SortField = 'value' | 'type' | 'severity' | 'confidence' | 'source' | 'lastSeen';
export type SortDirection = 'asc' | 'desc';

/* ─── State ─── */
export interface DashboardState {
  /* Filters */
  search: string;
  severity: Severity | '';
  type: IndicatorType | '';
  source: string;

  /* Pagination */
  page: number;
  totalPages: number;
  total: number;

  /* Sort (client-side) */
  sortField: SortField;
  sortDirection: SortDirection;

  /* Selection */
  selectedId: string | null;
  selectedIndicator: Indicator | null;

  /* Data */
  indicators: Indicator[];
  loading: boolean;
  error: string | null;
}

export const initialState: DashboardState = {
  search: '',
  severity: '',
  type: '',
  source: '',

  page: 1,
  totalPages: 1,
  total: 0,

  sortField: 'lastSeen',
  sortDirection: 'desc',

  selectedId: null,
  selectedIndicator: null,

  indicators: [],
  loading: true,
  error: null,
};

/* ─── Actions ─── */
export type DashboardAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SEVERITY'; payload: Severity | '' }
  | { type: 'SET_TYPE'; payload: IndicatorType | '' }
  | { type: 'SET_SOURCE'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SORT'; payload: SortField }
  | { type: 'SET_INDICATORS'; payload: { data: Indicator[]; total: number; totalPages: number; page: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_INDICATOR'; payload: string | null }
  | { type: 'SET_SELECTED_DETAIL'; payload: Indicator | null }
  | { type: 'CLEAR_FILTERS' };

/* ─── Reducer ─── */
export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_SEVERITY':
      return { ...state, severity: action.payload, page: 1 };
    case 'SET_TYPE':
      return { ...state, type: action.payload, page: 1 };
    case 'SET_SOURCE':
      return { ...state, source: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SORT': {
      const sameField = state.sortField === action.payload;
      return {
        ...state,
        sortField: action.payload,
        sortDirection: sameField
          ? (state.sortDirection === 'asc' ? 'desc' : 'asc')
          : 'desc',
      };
    }
    case 'SET_INDICATORS':
      return {
        ...state,
        indicators: action.payload.data,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SELECT_INDICATOR':
      return {
        ...state,
        selectedId: action.payload,
        selectedIndicator: action.payload === null ? null : state.selectedIndicator,
      };
    case 'SET_SELECTED_DETAIL':
      return { ...state, selectedIndicator: action.payload };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        search: '',
        severity: '',
        type: '',
        source: '',
        page: 1,
      };
    default:
      return state;
  }
}

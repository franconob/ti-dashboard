import { useState, useEffect } from 'react';
import type { Severity, IndicatorType } from '../../types/indicator';
import { useDashboardState, useDashboardDispatch } from '../../hooks/useDashboard';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Toolbar.module.css';

const SOURCES = [
  'AbuseIPDB', 'OTX AlienVault', 'VirusTotal', 'Emerging Threats',
  'MalwareBazaar', 'PhishTank', 'Spamhaus', 'ThreatFox', 'URLhaus',
  'CIRCL', 'Shodan', 'GreyNoise', 'BinaryEdge', 'Censys',
  'Silent Push', 'DomainTools',
];

export function Toolbar() {
  const state = useDashboardState();
  const dispatch = useDashboardDispatch();

  const [localSearch, setLocalSearch] = useState(state.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch !== state.search) {
      dispatch({ type: 'SET_SEARCH', payload: debouncedSearch });
    }
  }, [debouncedSearch, dispatch, state.search]);

  const hasFilters = state.search || state.severity || state.type || state.source;

  return (
    <div className={styles.toolbar}>
      <div className={styles.inputWrapper}>
        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.input}
          type="text"
          placeholder="Search indicators..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.group}>
        <select
          className={styles.select}
          value={state.severity}
          onChange={(e) => dispatch({ type: 'SET_SEVERITY', payload: e.target.value as Severity | '' })}
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className={styles.select}
          value={state.type}
          onChange={(e) => dispatch({ type: 'SET_TYPE', payload: e.target.value as IndicatorType | '' })}
        >
          <option value="">All Types</option>
          <option value="ip">IP Address</option>
          <option value="domain">Domain</option>
          <option value="hash">File Hash</option>
          <option value="url">URL</option>
        </select>
        <select
          className={styles.select}
          value={state.source}
          onChange={(e) => dispatch({ type: 'SET_SOURCE', payload: e.target.value })}
        >
          <option value="">All Sources</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          className={styles.clearBtn}
          onClick={() => {
            setLocalSearch('');
            dispatch({ type: 'CLEAR_FILTERS' });
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

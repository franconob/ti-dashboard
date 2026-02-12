import { useMemo, useState, useCallback } from 'react';
import type { Indicator } from '../../types/indicator';
import type { SortField, SortDirection } from '../../context/dashboardReducer';
import { useDashboardState, useDashboardDispatch } from '../../hooks/useDashboard';
import { useIndicators } from '../../hooks/useIndicators';
import { SeverityBadge } from '../shared/SeverityBadge';
import { ConfidenceBar } from '../shared/ConfidenceBar';
import { Tag } from '../shared/Tag';
import { timeAgo } from '../../utils/formatting';
import { ErrorState } from '../shared/ErrorState';
import { cn } from '../../utils/cn';
import styles from './DataTable.module.css';

const TYPE_ICONS: Record<string, string> = {
  ip: '\u2B21',
  domain: '\u25CE',
  hash: '#',
  url: '\uD83D\uDD17',
};

const TYPE_LABELS: Record<string, string> = {
  ip: 'IP',
  domain: 'Domain',
  hash: 'Hash',
  url: 'URL',
};

const SEVERITY_ORDER: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const COL_COUNT = 8;

function sortIndicators(data: Indicator[], field: SortField, direction: SortDirection): Indicator[] {
  return [...data].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'value':
        cmp = a.value.localeCompare(b.value);
        break;
      case 'type':
        cmp = a.type.localeCompare(b.type);
        break;
      case 'severity':
        cmp = (SEVERITY_ORDER[a.severity] ?? 0) - (SEVERITY_ORDER[b.severity] ?? 0);
        break;
      case 'confidence':
        cmp = a.confidence - b.confidence;
        break;
      case 'source':
        cmp = a.source.localeCompare(b.source);
        break;
      case 'lastSeen':
        cmp = new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime();
        break;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
}

function SortHeader({ field, label }: { field: SortField; label: string }) {
  const { sortField, sortDirection } = useDashboardState();
  const dispatch = useDashboardDispatch();
  const active = sortField === field;

  return (
    <th className={styles.th} onClick={() => dispatch({ type: 'SET_SORT', payload: field })}>
      {label}
      <span className={cn(styles.sortIcon, active && styles.sortActive)}>
        {active ? (sortDirection === 'asc' ? '\u2191' : '\u2193') : '\u21C5'}
      </span>
    </th>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className={styles.skeletonRow}>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '14px', height: '14px' }} /></td>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '180px' }} /></td>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '50px' }} /></td>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '60px' }} /></td>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '80px' }} /></td>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '80px' }} /></td>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '70px' }} /></td>
          <td className={styles.td}><div className={styles.skeleton} style={{ width: '60px' }} /></td>
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={COL_COUNT}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className={styles.emptyTitle}>No indicators found</div>
          <div className={styles.emptyText}>Try adjusting your search or filters</div>
        </div>
      </td>
    </tr>
  );
}

export function DataTable() {
  useIndicators();

  const { indicators, loading, error, sortField, sortDirection, selectedId } = useDashboardState();
  const dispatch = useDashboardDispatch();
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const sorted = useMemo(
    () => sortIndicators(indicators, sortField, sortDirection),
    [indicators, sortField, sortDirection],
  );

  const allChecked = sorted.length > 0 && sorted.every((i) => checkedIds.has(i.id));
  const someChecked = sorted.some((i) => checkedIds.has(i.id));

  const handleSelectAll = useCallback(() => {
    if (allChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(sorted.map((i) => i.id)));
    }
  }, [allChecked, sorted]);

  const handleToggleCheck = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleRowClick = (id: string) => {
    dispatch({ type: 'SELECT_INDICATOR', payload: selectedId === id ? null : id });
  };

  if (error) {
    return (
      <div className={styles.wrapper}>
        <ErrorState message={error} />
      </div>
    );
  }

  const showSkeleton = loading && sorted.length === 0;
  const showStale = loading && sorted.length > 0;

  return (
    <div className={styles.wrapper} style={showStale ? { opacity: 0.6, transition: 'opacity 0.2s ease' } : undefined}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={cn(styles.th, styles.thCheckbox)}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allChecked}
                ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                onChange={handleSelectAll}
                aria-label="Select all indicators"
              />
            </th>
            <SortHeader field="value" label="Indicator" />
            <SortHeader field="type" label="Type" />
            <SortHeader field="severity" label="Severity" />
            <SortHeader field="confidence" label="Confidence" />
            <SortHeader field="source" label="Source" />
            <th className={styles.th} style={{ cursor: 'default' }}>Tags</th>
            <SortHeader field="lastSeen" label="Last Seen" />
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            <TableSkeleton />
          ) : !loading && sorted.length === 0 ? (
            <EmptyState />
          ) : (
            sorted.map((indicator) => (
              <tr
                key={indicator.id}
                className={cn(styles.row, selectedId === indicator.id && styles.rowSelected)}
                onClick={() => handleRowClick(indicator.id)}
              >
                <td className={cn(styles.td, styles.tdCheckbox)} onClick={(e) => handleToggleCheck(indicator.id, e)}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checkedIds.has(indicator.id)}
                    readOnly
                    aria-label={`Select ${indicator.value}`}
                  />
                </td>
                <td className={cn(styles.td, styles.indicator)}>{indicator.value}</td>
                <td className={styles.td}>
                  <span className={styles.typeCell}>
                    {TYPE_ICONS[indicator.type]} {TYPE_LABELS[indicator.type]}
                  </span>
                </td>
                <td className={styles.td}>
                  <SeverityBadge severity={indicator.severity} />
                </td>
                <td className={styles.td}>
                  <ConfidenceBar confidence={indicator.confidence} severity={indicator.severity} />
                </td>
                <td className={cn(styles.td, styles.source)}>{indicator.source}</td>
                <td className={styles.td}>
                  <div className={styles.tags}>
                    {indicator.tags.map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                </td>
                <td className={cn(styles.td, styles.time)}>{timeAgo(indicator.lastSeen)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect } from 'react';
import { useDashboardState, useDashboardDispatch } from '../../hooks/useDashboard';
import { useIndicatorDetail } from '../../hooks/useIndicatorDetail';
import { SeverityBadge } from '../shared/SeverityBadge';
import { Tag } from '../shared/Tag';
import { timeAgo, formatDate } from '../../utils/formatting';
import { cn } from '../../utils/cn';
import styles from './DetailPanel.module.css';

const TYPE_ICONS: Record<string, string> = {
  ip: '\u2B21',
  domain: '\u25CE',
  hash: '#',
  url: '\uD83D\uDD17',
};

const TYPE_LABELS: Record<string, string> = {
  ip: 'IP Address',
  domain: 'Domain',
  hash: 'File Hash',
  url: 'URL',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'var(--severity-critical)',
  high: 'var(--severity-high)',
  medium: 'var(--severity-medium)',
  low: 'var(--severity-low)',
};

export function DetailPanel() {
  useIndicatorDetail();

  const { selectedId, selectedIndicator } = useDashboardState();
  const dispatch = useDashboardDispatch();
  const isOpen = selectedId !== null;
  const indicator = selectedIndicator;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch({ type: 'SELECT_INDICATOR', payload: null });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  const close = () => dispatch({ type: 'SELECT_INDICATOR', payload: null });

  return (
    <div
      className={cn(styles.panel, isOpen && styles.panelOpen)}
      role="dialog"
      aria-label="Indicator details"
      aria-hidden={!isOpen}
    >
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>Indicator Details</h3>
        <button className={styles.closeBtn} onClick={close} aria-label="Close panel">
          &#10005;
        </button>
      </div>

      {indicator ? (
        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Value</div>
            <div className={styles.detailValue}>{indicator.value}</div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Classification</div>
            <div className={styles.classification}>
              <SeverityBadge severity={indicator.severity} />
              <span className={styles.typeLabel}>
                {TYPE_ICONS[indicator.type]} {TYPE_LABELS[indicator.type]}
              </span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Confidence Score</div>
            <div className={styles.confidenceRow}>
              <div className={styles.confidenceBar}>
                <div
                  className={styles.confidenceFill}
                  style={{
                    width: `${indicator.confidence}%`,
                    background: SEVERITY_COLORS[indicator.severity],
                  }}
                />
              </div>
              <span
                className={styles.confidenceValue}
                style={{ color: SEVERITY_COLORS[indicator.severity] }}
              >
                {indicator.confidence}%
              </span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Tags</div>
            <div className={styles.tags}>
              {indicator.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Timeline</div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>First Seen</span>
              <span className={styles.rowValue}>{formatDate(indicator.firstSeen)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Last Seen</span>
              <span className={styles.rowValue}>{timeAgo(indicator.lastSeen)}</span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Source</div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Provider</span>
              <span className={styles.rowValue}>{indicator.source}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={cn(styles.actionBtn, styles.btnInvestigate)}>Investigate</button>
            <button className={cn(styles.actionBtn, styles.btnBlock)}>Block</button>
          </div>
        </div>
      ) : isOpen ? (
        <div className={styles.body}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.section}>
              <div className={cn(styles.skeleton)} style={{ width: '80px', height: '10px', marginBottom: '8px' }} />
              <div className={cn(styles.skeleton)} style={{ width: '200px', height: '16px' }} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

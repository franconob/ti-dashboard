import { useStats } from '../../hooks/useStats';
import { formatNumber } from '../../utils/formatting';
import { cn } from '../../utils/cn';
import styles from './StatsRow.module.css';

interface StatCardProps {
  label: string;
  value: number | null;
  sub: string;
  variant: 'total' | 'critical' | 'high' | 'medium' | 'low';
  loading: boolean;
}

function StatCard({ label, value, sub, variant, loading }: StatCardProps) {
  return (
    <div className={cn(styles.card, styles[variant])}>
      <div className={styles.cardHeader}>
        <span className={styles.label}>{label}</span>
        {variant === 'total' && (
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        )}
      </div>
      {loading ? (
        <>
          <div className={cn(styles.skeleton, styles.skeletonValue)} />
          <div className={cn(styles.skeleton, styles.skeletonSub)} />
        </>
      ) : (
        <>
          <div className={styles.value}>{value !== null ? formatNumber(value) : '—'}</div>
          <div className={styles.sub}>{sub}</div>
        </>
      )}
    </div>
  );
}

const CARD_CONFIG: Omit<StatCardProps, 'value' | 'loading'>[] = [
  { label: 'Total Indicators', sub: 'All tracked threats', variant: 'total' },
  { label: 'Critical', sub: 'Requires immediate action', variant: 'critical' },
  { label: 'High', sub: 'Active monitoring', variant: 'high' },
  { label: 'Medium', sub: 'Under review', variant: 'medium' },
  { label: 'Low', sub: 'Informational', variant: 'low' },
];

export function StatsRow() {
  const { stats, loading } = useStats();

  const values = [
    stats?.total ?? null,
    stats?.critical ?? null,
    stats?.high ?? null,
    stats?.medium ?? null,
    stats?.low ?? null,
  ];

  return (
    <div className={styles.row}>
      {CARD_CONFIG.map((config, i) => (
        <StatCard
          key={config.variant}
          {...config}
          value={values[i] ?? null}
          loading={loading}
        />
      ))}
    </div>
  );
}

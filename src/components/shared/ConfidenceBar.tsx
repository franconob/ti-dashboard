import type { Severity } from '../../types/indicator';
import styles from './ConfidenceBar.module.css';

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'var(--severity-critical)',
  high: 'var(--severity-high)',
  medium: 'var(--severity-medium)',
  low: 'var(--severity-low)',
};

interface ConfidenceBarProps {
  confidence: number;
  severity: Severity;
}

export function ConfidenceBar({ confidence, severity }: ConfidenceBarProps) {
  const color = SEVERITY_COLORS[severity];
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{ width: `${confidence}%`, background: color }}
        />
      </div>
      <span className={styles.value} style={{ color }}>
        {confidence}
      </span>
    </div>
  );
}

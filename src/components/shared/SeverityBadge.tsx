import type { Severity } from '../../types/indicator';
import { cn } from '../../utils/cn';
import styles from './SeverityBadge.module.css';

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn(styles.badge, styles[severity])}>
      {severity}
    </span>
  );
}

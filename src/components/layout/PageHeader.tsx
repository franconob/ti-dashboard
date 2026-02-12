import { cn } from '../../utils/cn';
import styles from './PageHeader.module.css';

export function PageHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Threat Intelligence Dashboard</h1>
        <p className={styles.subtitle}>Real-time threat indicators and campaign intelligence</p>
      </div>
      <div className={styles.actions}>
        <span className={styles.liveFeed}>
          <span className={styles.liveDot} />
          Live feed
        </span>
        <button className={cn(styles.btn, styles.btnSecondary)}>Export</button>
        <button className={cn(styles.btn, styles.btnPrimary)}>+ Add Indicator</button>
      </div>
    </div>
  );
}

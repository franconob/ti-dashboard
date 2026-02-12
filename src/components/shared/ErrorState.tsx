import { useDashboardDispatch } from '../../hooks/useDashboard';
import styles from './ErrorState.module.css';

export function ErrorState({ message }: { message: string }) {
  const dispatch = useDashboardDispatch();

  const handleRetry = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });
    // Trigger refetch by toggling page
    dispatch({ type: 'SET_PAGE', payload: 1 });
  };

  return (
    <div className={styles.error}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div className={styles.title}>Failed to load indicators</div>
      <div className={styles.message}>{message}</div>
      <button className={styles.retryBtn} onClick={handleRetry}>
        Retry
      </button>
    </div>
  );
}

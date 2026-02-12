import { useDashboardState, useDashboardDispatch } from '../../hooks/useDashboard';
import { formatNumber } from '../../utils/formatting';
import { cn } from '../../utils/cn';
import styles from './Pagination.module.css';

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);

  return pages;
}

export function Pagination() {
  const { page, totalPages, total } = useDashboardState();
  const dispatch = useDashboardDispatch();

  if (totalPages <= 1) return null;

  const start = (page - 1) * 20 + 1;
  const end = Math.min(page * 20, total);
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        Showing {formatNumber(start)}-{formatNumber(end)} of {formatNumber(total)} indicators
      </span>
      <div className={styles.controls}>
        <button
          className={styles.btn}
          disabled={page === 1}
          onClick={() => dispatch({ type: 'SET_PAGE', payload: page - 1 })}
          aria-label="Previous page"
        >
          &#8249;
        </button>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className={styles.ellipsis}>&hellip;</span>
          ) : (
            <button
              key={p}
              className={cn(styles.btn, p === page && styles.btnActive)}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: p })}
            >
              {p}
            </button>
          ),
        )}
        <button
          className={styles.btn}
          disabled={page === totalPages}
          onClick={() => dispatch({ type: 'SET_PAGE', payload: page + 1 })}
          aria-label="Next page"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

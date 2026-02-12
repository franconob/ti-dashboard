const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();

  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins}m ago`;
  }
  if (diff < DAY) {
    const hrs = Math.floor(diff / HOUR);
    return `${hrs}h ago`;
  }
  const days = Math.floor(diff / DAY);
  return `${days}d ago`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

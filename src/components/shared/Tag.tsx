import { getTagColor } from '../../utils/tagColors';
import { cn } from '../../utils/cn';
import styles from './Tag.module.css';

export function Tag({ label }: { label: string }) {
  const color = getTagColor(label);
  return (
    <span className={cn(styles.tag, styles[color])}>
      {label}
    </span>
  );
}

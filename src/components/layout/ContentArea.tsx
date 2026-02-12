import { Children, type ReactNode, type ReactElement, isValidElement } from 'react';
import styles from './ContentArea.module.css';

export function ContentArea({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children) as ReactElement[];
  const panel = childArray[childArray.length - 1];
  const tableChildren = childArray.slice(0, -1);

  return (
    <div className={styles.contentRow}>
      <div className={styles.tableArea}>
        {tableChildren.map((child, i) =>
          isValidElement(child) ? child : <div key={i}>{child}</div>,
        )}
      </div>
      {panel}
    </div>
  );
}

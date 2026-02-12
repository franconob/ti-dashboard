import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import styles from './DashboardLayout.module.css';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

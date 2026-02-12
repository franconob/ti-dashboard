import { cn } from '../../utils/cn';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
          <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
          <path d="M14 10l-5 10h10l-5-10z" fill="#6383ff" opacity="0.3" />
        </svg>
        <span className={styles.logoText}>Augur</span>
      </div>
      <nav className={styles.nav}>
        <div className={styles.section}>
          <a className={cn(styles.navItem, styles.navItemActive)} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
            <span className={styles.badge}>3</span>
          </a>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Augur Events
          </a>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Investigate
          </a>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Intelligence</div>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Threat Indicators
          </a>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
            </svg>
            Campaigns
          </a>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            Actors
          </a>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Reports</div>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Executive Reports
          </a>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Analytics
          </a>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Settings</div>
          <a className={styles.navItem} href="#">
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Integrations
          </a>
        </div>
      </nav>
    </aside>
  );
}

// GameNavigation — bottom nav or breadcrumb for game flow pages.
// Placeholder — will be wired to routing in Phase 2.
import { Link, useLocation } from 'react-router-dom';
import styles from './GameNavigation.module.css';
import gamesIcon from '../../../assets/icons/games-icon.png';
import redeemVeIcon from '../../../assets/icons/redeem-ve-icon.png';

export default function GameNavigation() {
  const { pathname } = useLocation();

  const navItems = [
    { label: 'Games',  href: '/games',  icon: gamesIcon },
    { label: 'Redeem', href: '/redeem', icon: redeemVeIcon },
  ];

  return (
    <nav className={styles.nav} aria-label="Game section navigation">
      {navItems.map(({ label, href, icon }) => (
        <Link
          key={href}
          to={href}
          className={`${styles.item} ${pathname.startsWith(href) ? styles.active : ''}`}
          aria-current={pathname.startsWith(href) ? 'page' : undefined}
        >
          <img src={icon} alt="" aria-hidden="true" className={styles.icon} width={20} height={20} />
          <span className={styles.label}>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

import { Link, useLocation } from 'react-router-dom';
import WalletWidget from '../WalletWidget';
import styles from './styles.module.scss';
import {ReactComponent as LogoDesktopSVG} from '../../assets/logo-desktop.svg';
import {ReactComponent as LogoMobileSVG} from '../../assets/logo-mobile.svg';
import TokenBalance from '../TokenBalance';
import classNames from 'classnames';
import { useAccount } from 'wagmi';

const NavBar = () => {
  const location = useLocation();
  const { data } = useAccount();

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.leftContainer}>
        <Link className={styles.desktop} to={'/'}><LogoDesktopSVG /></Link>
        <Link className={styles.mobile} to={'/'}><LogoMobileSVG /></Link>
          {data?.connector && <div className={styles.menu}>
            <Link className={classNames(styles.home, location.pathname === '/' ? styles.active : undefined)} to={'/'}>Home</Link>
            <Link className={location.pathname === '/stakes' ? styles.active : undefined} to={'/stakes'}>My Positions</Link>
          </div>}
      </div>

      {data?.connector && <TokenBalance />}

      <WalletWidget />
    </div>
  )
}

export default NavBar;

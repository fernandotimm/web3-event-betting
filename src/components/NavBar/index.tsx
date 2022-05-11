import { Link } from 'react-router-dom';
import WalletWidget from '../WalletWidget';
import styles from './styles.module.scss';
import {ReactComponent as LogoDesktopSVG} from '../../assets/logo-desktop.svg';
import {ReactComponent as LogoMobileSVG} from '../../assets/logo-mobile.svg';

const NavBar = () => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.leftContainer}>
        <LogoDesktopSVG className={styles.desktop}/>
        <LogoMobileSVG className={styles.mobile} />
        <div className={styles.menu}>
          <Link to={'/'}>Home</Link>
          <Link to={'/stakes'}>My Positions</Link>
        </div>
      </div>

      <WalletWidget />
    </div>
  )
}

export default NavBar;

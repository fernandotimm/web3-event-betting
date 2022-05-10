import { Link } from 'react-router-dom';
import WalletWidget from '../WalletWidget';
import styles from './styles.module.scss';

const NavBar = () => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.leftContainer}>
        <span>Wallfair.</span>
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

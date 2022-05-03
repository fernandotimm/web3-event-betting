import WalletWidget from '../WalletWidget';
import styles from './styles.module.scss';

const NavBar = () => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logo}>
        {/* Distributed Bets */}
      </div>
      <WalletWidget />
    </div>
  )
}

export default NavBar;

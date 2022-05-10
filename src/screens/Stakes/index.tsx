import { useAccount } from 'wagmi';
import styles from './styles.module.scss';
import StakesList from '../../components/StakesList';

const Stakes = () => {
  const { data } = useAccount();

  return (
    <div className={styles.stakesContainer}>
      {data?.connector && <StakesList />}
    </div>
  )
}

export default Stakes;

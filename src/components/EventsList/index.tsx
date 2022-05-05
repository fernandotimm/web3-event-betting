import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useConnectedContract from '../../hooks/useConnectedContract';
import StakesListRow from '../StakesListRow';
import styles from './styles.module.scss';

interface UserStake {
  stakeId:string,
  marketId: string,
  outcomeId: string,
  amount: string,
  user: string,
}

const EventsList = () => {
  const { data } = useAccount();
  const { contract } = useConnectedContract();
  const [stakes, setStakes] = useState<UserStake[]>([]);

  useEffect(() => {
    const fetchData = async () => {

    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract]);

  return (
    <div className={styles.stakesListContainer}>
      <h3>My Stakes</h3>
      {stakes.length > 0 && stakes?.map((stake:UserStake, index:number) => (
        <StakesListRow key={index} stake={stake} />
      ))}
    </div>
  )
}

export default EventsList;

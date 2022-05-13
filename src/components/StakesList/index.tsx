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

const StakesList = () => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract } = useConnectedContract(contractAddress);
  const [stakes, setStakes] = useState<UserStake[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userStakeIds:number[] = await contract?.getUserStakes(data?.address);
      // console.log({userStakeIds});

      const userStakes:UserStake[] = [];
      for (const userStakeId of userStakeIds) {
        const stake:UserStake = await contract?.getStake(userStakeId);
        // console.log(stake);
        userStakes.push({
          stakeId: userStakeId.toString(),
          marketId: stake.marketId.toString(),
          outcomeId: stake.outcomeId.toString(),
          amount: stake.amount.toString(),
          user: stake.user,
        });
      }

      setStakes(userStakes);
    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract]);

  return (
    <div className={styles.stakesListContainer}>
      <h1>My Stakes</h1>
      <div className={styles.headerRow}>
        <span>Market</span>
        <span>Outcome</span>
        <span className={styles.amount}>Amount</span>
        <span></span>
      </div>
      {stakes.length > 0 ?
        stakes?.map((stake:UserStake, index:number) => (
          <StakesListRow key={index} stake={stake} />
        ))
      :
        <span className={styles.noResults}>You did not stake yet</span>
      }
    </div>
  )
}

export default StakesList;

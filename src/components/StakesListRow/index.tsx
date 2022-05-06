import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';

interface UserStake {
  stakeId: string;
  marketId: string,
  outcomeId: string,
  amount: string,
  user: string,
}

interface MarketStake {
  question: string,
  outcome: string,
}

type Props = {
  stake: UserStake;
}

const StakesListRow = ({stake}:Props) => {
  const { data } = useAccount();
  const { contract } = useConnectedContract();
  const [marketQuestion, setMarketQuestion] = useState<string>();
  const [outcome, setOutcome] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {

      const marketData = await contract?.getMarket(stake.marketId);
      // console.log({marketData});
      const question:string = marketData[0].toString();
      const selectedOutcome:string = marketData[4].map((hexOutcome:string) => {
        return ethers.utils.parseBytes32String(hexOutcome)
      }).find((outcome:string,index:number) => {
        return index === +stake.outcomeId
      });

      const market:MarketStake = {
        question,
        outcome: selectedOutcome,
      }

      setMarketQuestion(market.question);
      setOutcome(market.outcome);
    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract, stake]);


  const handleCashout = useCallback(() => {
    contract?.removeStake(stake.stakeId, String(stake.amount));
  }, [contract, stake.amount, stake.stakeId]);

  return (
    <div className={styles.stakeRow}>
      <span>{marketQuestion}</span>
      <span>{outcome}</span>
      <span className={styles.amount}>{+stake.amount / 10**18} rETH</span>
      <button disabled={(+stake.amount / 10**18) === 0} onClick={handleCashout}>Cashout</button>
    </div>
  )
}

export default StakesListRow;

import classNames from 'classnames';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useState } from 'react';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';
import { commify } from 'ethers/lib/utils';
interface Market {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: number,
  totalStake: number,
}

interface TransactionError extends Error {
  data?: {
    message:string
  };
}

type Props = {
  market: Market;
}

const MarketCard = ({market}:Props) => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { contract } = useConnectedContract(contractAddress);
  const [selectedOutcome, setSelectedOutcome] = useState<number>();
  const [betAmount, setBetAmount] = useState<number>(10);

  const handlePlaceBet = useCallback(async () => {
    if (selectedOutcome === undefined || !betAmount) {
      console.log('Select outcome and bet amount.')
      toast.error("Select outcome and bet amount.");
      return;
    }

    try {
      await contract?.addStake(market.id, selectedOutcome, ethers.utils.parseUnits(String(betAmount)));

    }catch(e) {
      console.log(e);
      toast.error((e as TransactionError).data?.message || (e as Error).message);
    }

  }, [contract, betAmount, market.id, selectedOutcome]);

  const handleOutcomeSelected = useCallback((index:number) => {
    setSelectedOutcome(index);
  }, []);

  const handleBetAmountChange = useCallback((event:React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setBetAmount(+value);
  }, []);

  return (
    <div className={styles.marketContainer}>
      <div className={styles.questionContainer}>
        {/* <span className={styles.question}>{states[market.state]}</span> */}
        <span className={styles.question}>{market.question}</span>
        <div className={styles.outcomes}>
          {market.outcomes?.map((outcome, index) => (
            <button
              key={index}
              className={classNames(styles.outcome, selectedOutcome === index ? styles.active : null)}
              onClick={() => handleOutcomeSelected(index)}
            >
              {outcome}
            </button>
          ))}
        </div>
        <span className={styles.amountBet}><input type="number" step={1} placeholder="Bet amount in ETH" onChange={handleBetAmountChange} value={betAmount} /><span>WFAIR</span></span>
        <button onClick={handlePlaceBet}>Place Bet</button>
      </div>
      <div className={styles.liquidity}>Total Staked: {commify(ethers.utils.formatEther(market.totalStake.toString()))} <span>WFAIR</span></div>
    </div>
  )
}

export default MarketCard;

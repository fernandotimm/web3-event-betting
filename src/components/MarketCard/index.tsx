import classNames from 'classnames';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useState } from 'react';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';

interface Market {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: number,
  totalStake: number,
}

type Props = {
  market: Market;
}

const MarketCard = ({market}:Props) => {
  const { contract } = useConnectedContract();
  const [selectedOutcome, setSelectedOutcome] = useState<number>();
  const [betAmount, setBetAmount] = useState<number>(0.01);

  const handlePlaceBet = useCallback(() => {
    contract?.addStake(market.id, selectedOutcome, {value: ethers.utils.parseUnits(String(betAmount), "ether")});
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
        <span className={styles.amountBet}><input type="number" step={0.001} placeholder="Bet amount in ETH" onChange={handleBetAmountChange} value={betAmount} /><span>MATIC</span></span>
        <button onClick={handlePlaceBet}>Place Bet</button>
      </div>
      <div className={styles.liquidity}>Total Staked: {ethers.utils.formatEther(market.totalStake.toString())} <span>MATIC</span></div>
    </div>
  )
}

export default MarketCard;

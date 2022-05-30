import classNames from 'classnames';
import { ContractTransaction, ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';
import { commify } from 'ethers/lib/utils';
import Spinner from '../Spinner';
import { useWaitForTransaction } from 'wagmi';
import ButtonTheme from '../Button/ButtonTheme';
import Button from '../Button';

interface Market {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: string,
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
  const tokenAddress:string = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || '';
  const { contract : tokenContract } = useConnectedContract(tokenAddress);
  const [selectedOutcome, setSelectedOutcome] = useState<number>();
  const [betAmount, setBetAmount] = useState<number>(10);
  const [transaction, setTransaction] = useState<ContractTransaction>();

  const {isLoading, isSuccess} = useWaitForTransaction({
    hash: transaction?.hash,
  });

  // console.log({waitForTransaction});

  useEffect(() => {
    if (isSuccess) {
      toast.success('You successfully placed a bet!');
    }

  }, [isSuccess]);

  const handlePlaceBet = useCallback(async () => {

    if (selectedOutcome === undefined || !betAmount) {
      console.log('Select outcome and bet amount.')
      toast.error('Select outcome and bet amount.');
      return;
    }

    try {
      /*
      * Calls approveAndCall method of the token smart contract (ERC-1363)
      * which approves the spending amount and further calls the (callback)
      * method addStake(uint256, uint256) on the distabets smart contract.
      */

      // console.log(Math.floor(deadlineDate.getTime() / 1000))

      const addStakeParams = ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [market.id, selectedOutcome]);
      if (tokenContract) {
        const transaction = await tokenContract["approveAndCall(address,uint256,bytes)"](contractAddress, ethers.utils.parseEther(`${betAmount}`), addStakeParams);
        setTransaction(transaction);
      }

    }catch(e) {
      console.log(e);
      toast.error((e as TransactionError).data?.message || (e as Error).message);
    }

  }, [betAmount, market.id, selectedOutcome, tokenContract, contractAddress]);

  const handleOutcomeSelected = useCallback((index:number) => {
    setSelectedOutcome(index);
  }, []);

  const handleBetAmountChange = useCallback((event:React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setBetAmount(+value);
  }, []);

  return (
    <div className={styles.marketContainer}>
      {isLoading && <div className={styles.loadingLayer}>
        <Spinner />
        {transaction?.hash && <a href={`https://mumbai.polygonscan.com/tx/${transaction?.hash}`} target="_blank" rel="noreferrer">See transaction</a>}
      </div>}
      {market.image && (
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <img
              alt={`Uploaded file`}
              src={market.image}
            />
          </div>
        </div>
      )}
      <div className={styles.questionContainer}>
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
        <Button theme={ButtonTheme.primaryButtonS} onClick={handlePlaceBet}>Place Bet</Button>
      </div>
      <span className={styles.liquidity}>{`State: ${market.state}`}</span>
      <div className={styles.staked}>Total Staked: {commify(ethers.utils.formatEther(market.totalStake.toString()))} <span>WFAIR</span></div>
    </div>
  )
}

export default MarketCard;

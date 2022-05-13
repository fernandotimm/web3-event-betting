import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useState } from 'react';
import useConnectedContract from '../../hooks/useConnectedContract';
import Button from '../Button';
import ButtonTheme from '../Button/ButtonTheme';
import styles from './styles.module.scss';

const CreateMarketCard = () => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { contract } = useConnectedContract(contractAddress);
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());

  const handleCreateMarket = useCallback(() => {
    const image:string = "https://wallfair-storage-production.s3.eu-central-1.amazonaws.com/62286e0952d81593f82e417e/wallfair-logo.jpg" //todo
    const convertedOutcomes = outcomes.map((outcome:string) => ethers.utils.formatBytes32String(outcome));
    contract?.createMarket(title, image, deadlineDate.getTime() / 1000, convertedOutcomes);
  }, [contract, title, outcomes, deadlineDate]);

  const handleTitleChange = useCallback((event:React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setTitle(value);
  }, []);

  const handleAddOutcome = useCallback(() => {
    setOutcomes([...outcomes, '']);
  }, [outcomes]);

  const handleChangeOutcome = useCallback((event:React.FormEvent<HTMLInputElement>, idx:number) => {
    const newValue = event.currentTarget.value;
    const newOutcomes = [...outcomes];
    newOutcomes[idx] = newValue;
    setOutcomes([...newOutcomes]);
  }, [outcomes]);

  return (
    <div className={styles.marketContainer}>
      <div className={styles.questionContainer}>

        <input type="text" className={styles.question} value={title} onChange={handleTitleChange} placeholder="Add question" />

        <span className={styles.datePicker}>
          <span>Event ends at:</span>
          <input type="datetime-local" onChange={(e) => setDeadlineDate(new Date(e.target.value))} value={deadlineDate.toISOString().slice(0, -8)} required />
        </span>

        <div className={styles.outcomes}>
          {outcomes?.map((outcome, index) => (
            <input
              key={index}
              className={styles.outcome}
              value={outcome}
              onChange={event => handleChangeOutcome(event, index)}
              placeholder="option"
            />
          ))}
          <Button theme={ButtonTheme.secondaryButton} onClick={handleAddOutcome}>+</Button>
        </div>
        {/* <span className={styles.amountBet}><input type="number" step={0.001} placeholder="Bet amount in ETH" onChange={handleBetAmountChange} value={betAmount} /><span>WFAIR</span></span> */}

      </div>
      <Button theme={ButtonTheme.primaryButtonS} onClick={handleCreateMarket}>Create Event</Button>
    </div>
  )
}

export default CreateMarketCard;

import { useCallback } from 'react';
import { useState } from 'react';
import useCreateMarket from '../../hooks/useCreateMarket';
import useIFPFS from '../../hooks/useIPFS';
import { toBase64 } from '../../utils/commons';
import Button from '../Button';
import ButtonTheme from '../Button/ButtonTheme';
import styles from './styles.module.scss';

const CreateMarketCard = () => {
  const {createMarket} = useCreateMarket();
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [imageBase64, setImageBase64] = useState<string | ArrayBuffer | null>(''); //useState<{cid: CID; path: string}>();
  const ipfs = useIFPFS();

  const handleCreateMarket = useCallback(() => {
    // const convertedOutcomes = outcomes.map((outcome:string) => ethers.utils.formatBytes32String(outcome));
    // createMarket(title, image?.cid.toV1().toString() || '', deadlineDate.getTime() / 1000, convertedOutcomes);
    createMarket({
      title,
      outcomes,
      imageBase64,
      endDate,
    })
  }, [title, outcomes, endDate, imageBase64, createMarket]);

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

  const handleImageSelect = useCallback(async (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    const files:FileList | null = (event.target as HTMLInputElement).files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const fileBase64 = await toBase64(files[0]);
    console.log(fileBase64);
    if (fileBase64) {
      setImageBase64(fileBase64);
    }
  }, []);

  return (
    <div className={styles.marketContainer}>
      <div className={styles.questionContainer}>

      {!ipfs && (
        <p>Not connected to IPFS. Checkout out the logs for errors</p>
      )}

      {ipfs && (
        <input onChange={handleImageSelect} multiple={false} name="file" type="file" />
      )}

      {imageBase64 && (
        <img
          alt={`Uploaded file`}
          src={String(imageBase64)}
        />
      )}

        <input type="text" className={styles.question} value={title} onChange={handleTitleChange} placeholder="Add question" />

        <span className={styles.datePicker}>
          <span>Event ends at:</span>
          <input type="datetime-local" onChange={(e) => setEndDate(new Date(e.target.value))} value={endDate.toISOString().slice(0, -8)} required />
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

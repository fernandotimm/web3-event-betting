import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useState } from 'react';
import useConnectedContract from '../../hooks/useConnectedContract';
import Button from '../Button';
import ButtonTheme from '../Button/ButtonTheme';
import styles from './styles.module.scss';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";

const CreateMarketCard = () => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { contract } = useConnectedContract(contractAddress);
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());
  const [image, setImage] = useState<{cid: CID; path: string}>();

  // const projectId = "<YOUR PROJECT ID>";
  // const projectSecret = "<YOUR PROJECT SECRET>";
  // const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      // headers: {
      //   authorization,
      // },

    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }

  const handleCreateMarket = useCallback(() => {
    const convertedOutcomes = outcomes.map((outcome:string) => ethers.utils.formatBytes32String(outcome));
    contract?.createMarket(title, image?.cid.toV1().toString() || '', deadlineDate.getTime() / 1000, convertedOutcomes);
  }, [contract, title, outcomes, deadlineDate, image]);

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

  const onSubmitHandler = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const files = (form[0] as HTMLInputElement).files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];
    const result = await (ipfs as IPFSHTTPClient).add(file);

    setImage({
      cid: result.cid,
      path: result.path,
    });

    //form.reset();
  }, [ipfs]);

  return (
    <div className={styles.marketContainer}>
      <div className={styles.questionContainer}>

      {!ipfs && (
        <p>Not connected to IPFS. Checkout out the logs for errors</p>
      )}

      {ipfs && (
          <form onSubmit={onSubmitHandler}>
            <input name="file" type="file" />

            <button type="submit">Upload File</button>
          </form>
      )}

      {image && (
        <img
          alt={`Uploaded file`}
          src={"https://ipfs.infura.io/ipfs/" + image.path}
          style={{ maxWidth: "200px", margin: "15px" }}
          key={image.cid.toString()}
        />
      )}

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

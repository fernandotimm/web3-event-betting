import classNames from 'classnames';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import useConnectedContract from '../../hooks/useConnectedContract';
import { simplifyWalletAddress } from '../../utils/commons';
import styles from './styles.module.scss';

interface StakeChangedArgs {
  marketId: string,
  oldBalance?: string,
  newBalance?: string,
  user: string,
}

interface MarketCreatedArgs {
  creator: string,
  marketId: string,
  name: string,
}

type EventArgs = StakeChangedArgs & MarketCreatedArgs & { eventName: string, amount: number };

interface MarketData {
  question: string,
}

type Props = {
  event: EventArgs;
  connected: boolean;
}

const EventsListRow = ({event, connected}:Props) => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract } = useConnectedContract(contractAddress);
  const [marketQuestion, setMarketQuestion] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {

      // const marketData = await contract?.getMarket(event.marketId);
      // console.log({marketData});
      const question:string = event.marketId; //TODO get market question from JSON data

      const market:MarketData = {
        question,
      }

      setMarketQuestion(market.question);
    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract, event]);

  return (
    <div className={classNames(styles.stakeRow, connected ? styles.connected : null)}>
      <span>{event.eventName}</span>
      {connected && <span>{marketQuestion}</span>}
      <span className={styles.user}>{event.user && simplifyWalletAddress(event.user)}</span>
      <span className={styles.amount}>{event.amount && `${event.amount} WFAIR`}</span>
    </div>
  )
}

export default EventsListRow;

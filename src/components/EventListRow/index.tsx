import classNames from 'classnames';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import useConnectedContract from '../../hooks/useConnectedContract';
import { simplifyWalletAddress } from '../../utils/commons';
import styles from './styles.module.scss';

interface StakeChangedArgs {
  stakeId: string,
  marketId: string,
  amount: string,
  user: string,
}

interface MarketCreatedArgs {
  creator: string,
  marketId: string,
  name: string,
}

type EventArgs = StakeChangedArgs & MarketCreatedArgs & { eventName: string };

interface MarketData {
  question: string,
}

type Props = {
  event: EventArgs;
  connected: boolean;
}

const EventsListRow = ({event, connected}:Props) => {
  const { data } = useAccount();
  const { contract } = useConnectedContract();
  const [marketQuestion, setMarketQuestion] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {

      const marketData = await contract?.getMarket(event.marketId);
      // console.log(marketData);
      const question:string = marketData[0].toString();

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
      <span className={styles.amount}>{event.amount && `${event.amount} rETH`}</span>
    </div>
  )
}

export default EventsListRow;

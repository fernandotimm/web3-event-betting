import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import distabetsABI from "../../abis/distabets.json";
import EventsListRow from '../EventListRow';
import classNames from 'classnames';
import Spinner from '../Spinner';

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

type EventReceived = {
  name: string,
  args: StakeChangedArgs & MarketCreatedArgs
}

type Props = {
  connected?: boolean
}

type EventArgs = StakeChangedArgs & MarketCreatedArgs & { eventName: string, amount:number };

const EventsList = ({connected = true}:Props) => {
  const [events, setEvents] = useState<EventArgs[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
      const provider = new ethers.providers.InfuraProvider(
        "maticmum",
        process.env.REACT_APP_PROVIDER_API_KEY
      );
      const latestBlock = await provider.getBlockNumber();
      const logs = await provider.getLogs({
        fromBlock: latestBlock - 3499, //max block size limited to 3500 (Infura Polygon)
        toBlock: "latest",
        address: contractAddress,
      });

      const iface = new ethers.utils.Interface(distabetsABI);
      const decodedEvents = logs.map(log => {
        return iface.parseLog(log);
      });

      const parsedEvents:EventArgs[] = decodedEvents
      .filter(event => ['MarketCreated','StakeChanged'].includes(event.name))
      // .filter(event => ['StakeChanged'].includes(event.name))
      .map((event) => {
        console.log(event);
        const {name, args}:EventReceived = event as unknown as EventReceived;
        const newBalance = ethers.utils.formatEther(args.oldBalance ?? 0);
        const oldBalance = ethers.utils.formatEther(args.newBalance ?? 0);
        const amount = +oldBalance - +newBalance;
        return {
          eventName: name,
          amount: amount,
          user: args.user,
          marketId: args.marketId?.toString(),
          creator: args.creator,
          name: args.name,
        }
      });

      setEvents(parsedEvents);
      setLoaded(true);
    }

    fetchData();

  }, []);

  return (
    <div className={styles.stakesListContainer}>
      <h3>Recent Activity</h3>
      <div className={classNames(styles.headerRow, connected ? styles.connected : null)}>
        <span>Activity</span>
        {connected && <span>Market</span>}
        <span className={styles.user}>Address</span>
        <span className={styles.amount}>Amount</span>
      </div>
      {events.length > 0 ?
        events?.map((event:EventArgs, index:number) => (
          <EventsListRow key={index} event={event} connected={connected} />
        ))
      :
        <>
          {!loaded && <Spinner />}
          {loaded && <span className={styles.noResults}>There is no recent activity</span>}
        </>
      }
    </div>
  )
}

export default EventsList;

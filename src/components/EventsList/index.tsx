import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';
import distabetsABI from "../../abis/distabets.json";
import EventsListRow from '../EventListRow';

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

type EventReceived = {
  name: string,
  args: StakeChangedArgs & MarketCreatedArgs
}

type EventArgs = StakeChangedArgs & MarketCreatedArgs & { eventName: string };

const EventsList = () => {
  const { data } = useAccount();
  const { contract } = useConnectedContract();
  const [events, setEvents] = useState<EventArgs[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const latestBlock = await provider.getBlockNumber();
      const logs = await provider.getLogs({
        fromBlock: latestBlock - 9000,
        toBlock: "latest",
        address: contract?.address,
      });

      const iface = new ethers.utils.Interface(distabetsABI);
      const decodedEvents = logs.map(log => {
        return iface.parseLog(log);
      });

      const parsedEvents:EventArgs[] = decodedEvents
      .filter(event => ['MarketCreated','StakeChanged'].includes(event.name))
      .map((event) => {
        const {name, args}:EventReceived = event as unknown as EventReceived;
        return {
          eventName: name,
          amount: args.amount ? ethers.utils.formatEther(args.amount) : '',
          stakeId: args.stakeId?.toString(),
          user: args.user,
          marketId: args.marketId?.toString(),
          creator: args.creator,
          name: args.name,
        }
      });

      setEvents(parsedEvents);
    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract]);

  return (
    <div className={styles.stakesListContainer}>
      <h3>Latest Events</h3>
      <div className={styles.headerRow}>
        <span>Event</span>
        <span>Market</span>
        <span className={styles.user}>Address</span>
        <span className={styles.amount}>Amount</span>
      </div>
      {events.length > 0 && events?.map((event:EventArgs, index:number) => (
        <EventsListRow key={index} event={event} />
      ))}
    </div>
  )
}

export default EventsList;

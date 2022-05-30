import { useAccount } from 'wagmi';
import styles from './styles.module.scss';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import MarketCard from '../../components/MarketCard';
import useConnectedContract from '../../hooks/useConnectedContract';
import CreateMarketCard from '../../components/CreateMarketCard';
import EventsList from '../../components/EventsList';
import classNames from 'classnames';
import Spinner from '../../components/Spinner';
import { getIpfsHashFromBytes32 } from '../../utils/conversion';
import { fetchJSONfromIPFS } from '../../api';

interface Market {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: string,
  totalStake: number
}

type MarketState = {
  [k:string]: string,
}

const states:MarketState = {
  '0': 'OPEN',
  '1': 'CLOSED',
  '2': 'CANCELED'
};

const Home = () => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract } = useConnectedContract(contractAddress);
  const [markets, setMarkets] = useState<Market[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [currentStateIndex, setCurrentStateIndex] = useState<string>('1');

  useEffect(() => {
    const fetchData = async () => {
      //DEV MOCK
      const knownMarketIds:string[] = ['0xa91828f71d688dd3a7cb1b99637daa7f56b31d7df14dc43310fcda7ae561377f', '0x3446b07728e67a68e7f86829942137887799234b46cb20e6c0bcdd5ae9917bba'];

      const marketsArray : Market[] = [];

      for (let marketId of knownMarketIds) {
        const market = await contract?.getMarket(marketId);

        // Response structure getMarket() from distabets smart contract
        //  [
        //     oracle,
        //     creator,
        //     numOutcomes,
        //     closingTime,
        //     disputeEnd,
        //     totalStake,
        //     finalOutcomeId,
        //     feeCollected,
        //     state
        //  ]

        const ipfsCID = getIpfsHashFromBytes32(marketId);
        const jsonData = await fetchJSONfromIPFS(ipfsCID);
        console.log(jsonData);

        marketsArray.push({
          id: String(marketId),
          question: jsonData.title ?? jsonData.question,
          image: jsonData.imageBase64,
          outcomes: jsonData.outcomes,
          state: String(market[8]),
          totalStake: market[5]
        })
      }

      console.log({marketsArray});
      setMarkets(marketsArray);
      setLoaded(true);
    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract]);

  const handleTabClick = useCallback((stateIndex:string) => {
    setCurrentStateIndex(stateIndex);
  }, []);

  if (!data?.connector) {
    return (
      <div className={styles.homeContainer}>
        <p>Connect your wallet to see the markets</p>
        <EventsList connected={false} />
      </div>
    )
  }

  return (
    <div className={styles.homeContainer}>
      {data?.connector && <>
        <h1>Events</h1>
        <div className={styles.tabNav}>
          {Object.entries(states).map(([stateKey, stateValue]) => (
            <span key={stateKey} className={classNames(styles.tab, stateKey === currentStateIndex ? styles.active : null)} onClick={() => handleTabClick(stateKey)}>{stateValue}</span>
          ))}
        </div>

        <div className={styles.marketsOverview}>
          {!loaded && <span className={styles.status}><Spinner /></span>}
          {markets?.filter(market => market.state === currentStateIndex).map((market, index) => (
            <MarketCard key={index} market={market} />
          ))}
          <CreateMarketCard />
        </div>

      </>}
      <EventsList />
    </div>
  )
}

export default Home;

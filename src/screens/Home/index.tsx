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
  endDate: Date,
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
  const [currentStateIndex, setCurrentStateIndex] = useState<string>('0');

  useEffect(() => {
    const fetchData = async () => {
      //DEV MOCK
      const knownMarketIds:string[] = [
        '0xfa4a37d6b7b8217a6b5f527eaca2ef94b09ee3470a06b4c4c4595dfccd5370c0',
        '0xf71b5fb6bcb91a12c2a8353881fb5e5fc0650d04b02281cc9423466ad8303931',
      ];

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
          totalStake: market[5],
          endDate: new Date(market[3] * 1000),
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

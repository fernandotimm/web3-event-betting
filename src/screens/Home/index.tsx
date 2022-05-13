import { useAccount } from 'wagmi';
import styles from './styles.module.scss';
import { BigNumberish, ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import MarketCard from '../../components/MarketCard';
import useConnectedContract from '../../hooks/useConnectedContract';
import CreateMarketCard from '../../components/CreateMarketCard';
import EventsList from '../../components/EventsList';
import classNames from 'classnames';
import Spinner from '../../components/Spinner';

interface Market {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: number,
  totalStake: number
}

const states = ['OPEN', 'CLOSED', 'CANCELED'];

const Home = () => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract } = useConnectedContract(contractAddress);
  const [markets, setMarkets] = useState<Market[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const lastIdxBN:BigNumberish = await contract?.getMarketIndex();
      // console.log(lastIdxBN);
      const lastIdx:number = +lastIdxBN.toString();

      const marketsArray : Market[] = [];

      for (let i:number = 1; i <= lastIdx; i++) {
        const market = await contract?.getMarket(i);
        // console.log(market);
        const outcomes:string[] = market[4].map((hexOutcome:string) => { return ethers.utils.parseBytes32String(hexOutcome)});
        marketsArray.push({
          id: String(i),
          question: market[0],
          image: market[1],
          outcomes: outcomes,
          state: market[2],
          totalStake: market[3]
        })
      }

      // console.log({marketsArray});
      setMarkets(marketsArray);
      setLoaded(true);
    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract]);

  const handleTabClick = useCallback((stateIndex:number) => {
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
        {/* <div className={styles.numberOfMarkets}><span className={styles.amount}>{lastIndex}</span> events on-chain</div> */}
        <h1>Events</h1>
        <div className={styles.tabNav}>
          {states.map((stateName, index) => (
            <span key={index} className={classNames(styles.tab, stateName === states[currentStateIndex] ? styles.active : null)} onClick={() => handleTabClick(index)}>{stateName}</span>
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

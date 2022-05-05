import { useAccount } from 'wagmi';
import styles from './styles.module.scss';
import { BigNumberish, ethers } from 'ethers';
import { useState } from 'react';
import { useEffect } from 'react';
import MarketCard from '../../components/MarketCard';
import useConnectedContract from '../../hooks/useConnectedContract';
import CreateMarketCard from '../../components/CreateMarketCard';
import StakesList from '../../components/StakesList';

interface Market {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: number,
  totalStake: number
}

const Home = () => {
  const { data } = useAccount();
  const { contract } = useConnectedContract();
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [markets, setMarkets] = useState<Market[]>();

  useEffect(() => {
    const fetchData = async () => {
      const lastIdxBN:BigNumberish = await contract?.getMarketIndex();
      // console.log(lastIdxBN);
      const lastIdx:number = +lastIdxBN.toString();
      setLastIndex(lastIdx);

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
    }

    if (data && contract) {
      fetchData();
    }
  }, [data, contract]);

  return (
    <div className={styles.homeContainer}>
      {data?.connector && <>
        <div className={styles.numberOfMarkets}><span className={styles.amount}>{lastIndex}</span> events on-chain</div>

        <div className={styles.marketsOverview}>
          {!markets?.length && <span className={styles.status}>Loading...</span>}
          {markets?.map((market, index) => (
            <MarketCard key={index} market={market} />
          ))}
          <CreateMarketCard />
        </div>

        <StakesList />
      </>}
    </div>
  )
}

export default Home;

import { useAccount } from 'wagmi';
import styles from './styles.module.scss';
import { BigNumberish, ethers } from 'ethers';
import { useState } from 'react';
import { useEffect } from 'react';
import MarketCard from '../../components/MarketCard';
import useConnectedContract from '../../hooks/useConnectedContract';

interface Market {
  id: string,
  question: string,
  outcomes: string[],
  value: number
}

const Home = () => {
  const { data } = useAccount();
  const { contract } = useConnectedContract();
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [markets, setMarkets] = useState<Market[]>();

  useEffect(() => {
    const fetchData = async () => {
      const lastIdxBN:BigNumberish = await contract?.marketIndex();
      const lastIdx:number = +lastIdxBN.toString();
      setLastIndex(lastIdx);

      const marketsArray : Market[] = [];

      for (let i:number = 0; i < lastIdx; i++) {
        const market = await contract?.getMarket(i);
        const outcomes:string[] = market[1].map((hexOutcome:string) => { return ethers.utils.parseBytes32String(hexOutcome)});
        marketsArray.push({
          id: String(i),
          question: market[0],
          outcomes: outcomes,
          value: market[2],
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
        </div>
      </>}
    </div>
  )
}

export default Home;

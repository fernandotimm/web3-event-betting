import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import MarketBet from '../../components/MarketBet';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';

interface MarketData {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: number,
  totalStake: number
}

const Market = () => {
  const {marketIdParam} = useParams();

  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract } = useConnectedContract(contractAddress);
  const [market, setMarket] = useState<MarketData>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const marketId:number = parseInt(marketIdParam || '');


  useEffect(() => {

    const fetchData = async () => {
      const market = await contract?.getMarket(marketId);
      const outcomes:string[] = market[4].map((hexOutcome:string) => { return ethers.utils.parseBytes32String(hexOutcome)});
      setMarket({
        id: String(marketId),
        question: market[0],
        image: market[1],
        outcomes: outcomes,
        state: market[2],
        totalStake: market[3]
      });
      setLoaded(true);
    }

    if (data && contract && marketId) {
      fetchData();
    }
  }, [data, contract, marketId]);

  return (
    <div className={styles.marketContainer}>
      <div className={styles.topContainer}>
        <Link to={'/'} className={styles.backButton}>&lt; Back to Events</Link>
        <span className={styles.timeLeft}>Ends in: 16 days 13 hours 8 minutes</span>
      </div>
      <div>
        {market && <MarketBet market={market} />}
      </div>

    </div>
  )
}

export default Market;

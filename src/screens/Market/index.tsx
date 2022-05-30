
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { fetchJSONfromIPFS } from '../../api';
import MarketBet from '../../components/MarketBet';
import useConnectedContract from '../../hooks/useConnectedContract';
import { getIpfsHashFromBytes32 } from '../../utils/conversion';
import styles from './styles.module.scss';

interface MarketData {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: string,
  totalStake: number
}

const Market = () => {
  const {marketIdParam} = useParams();

  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract } = useConnectedContract(contractAddress);
  const [market, setMarket] = useState<MarketData>();
  // const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {

    const fetchData = async () => {
      const market = await contract?.getMarket(marketIdParam);
      const ipfsCID = getIpfsHashFromBytes32(marketIdParam);
      const jsonData = await fetchJSONfromIPFS(ipfsCID);

      setMarket({
        id: String(marketIdParam),
        question: jsonData.title ?? jsonData.question,
        image: jsonData.imageBase64,
        outcomes: jsonData.outcomes,
        state: String(market[8]),
        totalStake: market[5]
      });
      // setLoaded(true);
    }

    if (data && contract && marketIdParam) {
      fetchData();
    }
  }, [data, contract, marketIdParam]);

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


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { fetchJSONfromIPFS } from '../../api';
import MarketBet from '../../components/MarketBet';
import useConnectedContract from '../../hooks/useConnectedContract';
import { diffTime } from '../../utils/commons';
import { getIpfsHashFromBytes32 } from '../../utils/conversion';
import styles from './styles.module.scss';

interface MarketData {
  id: string,
  question: string,
  image: string,
  outcomes: string[],
  state: string,
  totalStake: number
  endDate: Date,
}

const Market = () => {
  const {marketIdParam} = useParams();

  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract } = useConnectedContract(contractAddress);
  const [market, setMarket] = useState<MarketData>();

  console.log('...', market?.endDate);

  const [days, hours, minutes] = market?.endDate ? diffTime(market.endDate, new Date(Date.now())) : [];
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
        totalStake: market[5],
        endDate: new Date(market[3] * 1000),
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
        {market && market.endDate && market.endDate > new Date() ? (
          <span className={styles.timeLeft}>
            <span className={styles.timerLabel}>Ends in: </span>
            <span className={styles.timerValue}>{days || 0}</span>
            <span className={styles.timerUnit}>{days === 1 ? `day` : `days`}</span>
            <span className={styles.timerValue}>{hours || 0}</span>
            <span className={styles.timerUnit}>hrs </span>
            <span className={styles.timerValue}>{minutes || 0}</span>
            <span className={styles.timerUnit}>min </span>
          </span>
        ) : (
          <span className={styles.timeLeft}>Event Ended</span>
        )}
      </div>
      <div>
        {market && <MarketBet market={market} />}
      </div>

    </div>
  )
}

export default Market;

import { useAccount } from 'wagmi';
import styles from './styles.module.scss';
import distabetsABI from '../../abis/distabets.json';
import { BigNumberish, Contract, ethers, Signer } from 'ethers';
import { useState } from 'react';
import { useEffect } from 'react';

interface Market {
  question: string,
  outcomes: string[],
  value: number
}

const Home = () => {
  const contractAddress:string = process.env.REACT_APP_CONTRACT_ADDRESS || '';

  const { data } = useAccount();
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [markets, setMarkets] = useState<Market[]>();
  const [contract, setContract] = useState<Contract | undefined>();

  useEffect(() => {

    if (!data?.connector?.getSigner) {
      return;
    }

    const prepareContract = async () => {
      const signer:Signer | undefined = await data?.connector?.getSigner();

      if (signer) {
        const contract:Contract = new Contract(
          contractAddress,
          distabetsABI,
          signer,
        );

        setContract(contract);
      }
    }

    prepareContract();

  }, [data, data?.connector, contractAddress]);

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
            <div key={index} className={styles.marketContainer}>
              <div className={styles.questionContainer}>
                <span className={styles.question}>{market.question}</span>
                <div className={styles.outcomes}>
                  {market.outcomes?.map((outcome, indexOutcome) => (
                    <span key={`${index}-${indexOutcome}`} className={styles.outcome}>{outcome}</span>
                  ))}
                </div>
              </div>
              <div className={styles.liquidity}>Liquidity: {market.value}</div>
            </div>
          ))}
        </div>


      </>}
    </div>
  )
}

export default Home;

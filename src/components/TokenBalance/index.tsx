import { BigNumber, ethers } from 'ethers';
import { commify } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';

const TokenBalance = () => {
  const tokenAddress:string = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract : tokenContract } = useConnectedContract(tokenAddress);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const balance:BigNumber = await tokenContract?.balanceOf(data?.address);
      setTokenBalance(+ethers.utils.formatEther(balance.toString()));
    }

    if (data && tokenContract) {
      fetchData();
    }
  }, [data, tokenContract]);

  return (
    <div className={styles.tokenBalance}>
      <span>Token Balance: {`${commify(tokenBalance)} WFAIR`}</span>
    </div>
  )
}

export default TokenBalance;

import { BigNumber, ethers } from 'ethers';
import { commify } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useConnectedContract from '../../hooks/useConnectedContract';
import styles from './styles.module.scss';

const SpendingLimit = () => {
  const distabetsAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const tokenAddress:string = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
  const { contract : tokenContract } = useConnectedContract(tokenAddress);
  const { contract } = useConnectedContract(distabetsAddress);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [spendingLimit, setSpendingLimit] = useState<number>(0);
  const [spendingInput, setSpendingInput] = useState<number | undefined>();
  const [changeClicked, setChangeClicked] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const allowedAmount:BigNumber = await tokenContract?.allowance(data?.address, distabetsAddress);
      setSpendingLimit(+ethers.utils.formatEther(allowedAmount.toString()));

      const balance:BigNumber = await tokenContract?.balanceOf(data?.address);
      setTokenBalance(+ethers.utils.formatEther(balance.toString()));
    }

    if (data && tokenContract) {
      fetchData();
    }
  }, [data, contract, distabetsAddress, tokenContract]);

  const handleSpendingChange = useCallback((event:React.FormEvent<HTMLInputElement>) => {
    const value = parseFloat(event.currentTarget.value);
    setSpendingInput(value);
  }, []);

  const handleApprove = useCallback(() => {
    tokenContract?.approve(distabetsAddress, ethers.utils.parseEther(`${spendingInput}`));
  }, [tokenContract, distabetsAddress, spendingInput]);

  return (
    <div className={styles.spendingLimit}>
      <span className={styles.note}>For security reasons, you first need to approve an amount of WFAIR tokens which will be available to play in the platform.</span>
      <div>
        <span>Spending Limit: {`${commify(spendingLimit)} WFAIR`}</span>
        {!changeClicked ?
          <button className={styles.changeButton} onClick={()=>setChangeClicked(true)}>Change</button>
        :
          <>
            <input type="number" value={spendingInput} onChange={handleSpendingChange} placeholder="Enter amount of WFAIR"/>
            <button className={styles.approveButton} onClick={handleApprove}>Approve</button>
          </>
        }
      </div>
      <span className={styles.note}>Token Balance: {`${commify(tokenBalance)} WFAIR`}</span>
    </div>
  )
}

export default SpendingLimit;

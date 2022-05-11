import { ContractInterface } from 'ethers';
import {distabetsABI, wfairABI} from '../abis';

const simplifyWalletAddress = (addr:string):string => {
  return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
}

const getAbis = ():Record<string, ContractInterface> => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const tokenAddress:string = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || '';

  return {
    [contractAddress]: distabetsABI,
    [tokenAddress]: wfairABI,
  }
}

export {
  simplifyWalletAddress,
  getAbis,
}

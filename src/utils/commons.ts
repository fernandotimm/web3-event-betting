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

const diffTime = (date1: Date, date2: Date):[number, number, number, number] => {
  let delta = Math.abs(date1.getTime() - date2.getTime()) / 1000;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  const seconds = Math.round(delta % 60);

  return [days, hours, minutes, seconds]
}

export {
  simplifyWalletAddress,
  getAbis,
  diffTime,
}

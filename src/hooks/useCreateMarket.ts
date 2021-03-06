import { IPFSHTTPClient } from 'ipfs-http-client';
import { useAccount } from 'wagmi';
import { getBytes32FromIpfsHash } from '../utils/conversion';
import useConnectedContract from './useConnectedContract';
import useIFPFS from './useIPFS';


type MarketCreateData = {
  title: string;
  outcomes: string[];
  imageBase64: string | ArrayBuffer | null;
  endDate: Date;
}

const useCreateMarket = () => {
  const contractAddress:string = process.env.REACT_APP_DISTAMARKETS_CONTRACT_ADDRESS || '';
  const { contract } = useConnectedContract(contractAddress);
  const { data } = useAccount();
  const ipfs = useIFPFS();

  const createMarket = async ({title, outcomes, imageBase64, endDate}:MarketCreateData) => {

    if (!ipfs) {
      return;
    }
    const stringJSON = JSON.stringify({
      title,
      outcomes,
      imageBase64,
      endDate
    });

    const metadata = await (ipfs as IPFSHTTPClient).add(stringJSON);
    const cid = metadata.cid.toV0();

    const cidBytes32 = getBytes32FromIpfsHash(cid.toString());

    console.log(cid.toString());
    console.log('cidBytes32:', cidBytes32);

    contract?.createMarket(cidBytes32, data?.address, endDate.getTime() / 1000, outcomes.length);
  }

  return {
    createMarket,
  }

}

export default useCreateMarket;

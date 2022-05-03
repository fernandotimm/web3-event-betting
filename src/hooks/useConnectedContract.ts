import { Contract, Signer } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import distabetsABI from "../abis/distabets.json";


const useConnectedContract = () => {
  const contractAddress:string = process.env.REACT_APP_CONTRACT_ADDRESS || '';
  const { data } = useAccount();
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

  return {
    contract
  }

}

export default useConnectedContract;

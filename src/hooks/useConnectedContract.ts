import { Contract, ContractInterface, Signer } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getAbis } from "../utils/commons";


const useConnectedContract = (contractAddress:string = '') => {
  const { data } = useAccount();
  const [contract, setContract] = useState<Contract | undefined>();

  useEffect(() => {
    if (!data?.connector?.getSigner) {
      return;
    }

    const prepareContract = async () => {
      const signer:Signer | undefined = await data?.connector?.getSigner();

      if (signer) {
        const selectedABI:ContractInterface = getAbis()[contractAddress];
        const contract:Contract = new Contract(
          contractAddress,
          selectedABI,
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

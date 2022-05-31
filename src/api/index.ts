
type JSONData = {
    question: string,
    title?:string,
    outcomes: string[],
    endDate: number,
    imageBase64: string
}

export const fetchMarkets = () => {
  //TODO
}


export const fetchJSONfromIPFS = async (cid:string) => {
  const result = await fetch(`https://ipfs.infura.io/ipfs/${cid}`);
  return result.json() as Promise<JSONData>;
}

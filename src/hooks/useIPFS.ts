import { create, IPFSHTTPClient } from "ipfs-http-client";

const useIFPFS = () => {
  // const projectId = "<YOUR PROJECT ID>";
  // const projectSecret = "<YOUR PROJECT SECRET>";
  // const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

  let ipfs: IPFSHTTPClient | undefined;

  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      // headers: {
      //   authorization,
      // },

    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }

  return ipfs;

}

export default useIFPFS;

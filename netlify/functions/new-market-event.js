const distamarkets = require("./data/distamarkets");
const { 
    getIpfsHashFromBytes32 
} = require("./conversions");

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

exports.handler = async function(event, context) {
    console.log("body", event.body);
    console.log("parsed", JSON.parse(event.body));

    let json = JSON.parse(event.body);
    let marketId = json.events[0].matchReasons[0].params.marketId;

    // get cid from marketId
    let ipfsHash = getIpfsHashFromBytes32(marketId);
    
    // load metadata from ipfs
    let files = await ipfs.files.get(ipfsHash);
    let metadata = JSON.parse(files[0].content.toString('utf8'));
    
    let { title, outcomes, imageBase64 } = metadata;
    
    await distamarkets.init();

    // load from blockchain and store everything in mongo
    await distamarkets.onMarketCreated(marketId, title, imageBase64, outcomes);

    await distamarkets.close();

    return {
        statusCode: 200,
        body: "OK"
    };
}

require("dotenv").config();
var fs = require("fs");
var path = require("path");

const { 
    DISTAMARKETS_ADDRESS, 
    RPC_URL, 
    MONGODB_URL 
} = process.env;

// Initialize web3 
const Web3 = require("web3");
const web3 = new Web3(RPC_URL);
const BN = web3.utils.BN;
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, "distamarkets.abi")));

const contract = new web3.eth.Contract(abi, DISTAMARKETS_ADDRESS);

// Initialize mongo and vars
const { MongoClient } = require('mongodb');
let client, mongodb, marketsdb;

const init = async () => {
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    mongodb = client.db("distamarkets");

    marketsdb = mongodb.collection("markets");
    console.log("mongodb initialized")
};

const close = async () => {
    await client.close();
    console.log("mongodb closed")
};

const getMarket = async (marketId) => {
    return await marketsdb.findOne({
        marketId,
        address: DISTAMARKETS_ADDRESS
    });
}

const findMarkets = async (filter = {}, options = {}) => {
    return await marketsdb.find(filter, options).toArray();
}

const onMarketCreated = async (marketId, title, image, outcomes) => {
    let chainData = await contract.methods.getMarket(marketId).call();

    let marketData = {
        marketId,
        address: DISTAMARKETS_ADDRESS,
        oracle: chainData["0"],
        creator: chainData["1"],
        numOutcomes: parseInt(chainData["2"]),
        closingTime: parseInt(chainData["3"]),
        disputeEnd: parseInt(chainData["4"]),
        totalStake: new BN(chainData["5"]),
        finalOutcomeId: parseInt(chainData["6"]),
        feeCollected: new BN(chainData["7"]),
        state: chainData.state,
        title,
        image,
        outcomes
    }

    const filter = {
        marketId: marketData.marketId,
        address: DISTAMARKETS_ADDRESS
    };

    const options = { upsert: true };

    let result = await marketsdb.updateOne(filter, {
        $set: marketData
    }, options);

    console.log("market created", result);
}

module.exports = {
    init,
    close,
    onMarketCreated,
    getMarket,
    findMarkets
}
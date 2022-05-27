const distamarkets = require("./data/distamarkets");

exports.handler = async function(event, context) {
    console.log("body", event.body);
    console.log("parsed", JSON.parse(event.body));

    let json = JSON.parse(event.body);

    await distamarkets.init();

    let market = await distamarkets.getMarket(json.marketId);

    await distamarkets.close();
    
    return {
        statusCode: 200,
        body: JSON.stringify(market)
    };
}

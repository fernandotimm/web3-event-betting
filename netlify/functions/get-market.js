const distamarkets = require("./data/distamarkets");

exports.handler = async function(event, context) {
    console.log("body", event.body);
    console.log("parsed", JSON.parse(event.body));

    let json = JSON.parse(event.body);

    let market = await distamarkets.getMarket(json.marketId);

    return {
        statusCode: 200,
        body: JSON.stringify(market)
    };
}

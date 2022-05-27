const distamarkets = require("./data/distamarkets");

exports.handler = async function(event, context) {
    console.log("body", event.body);
    console.log("parsed", JSON.parse(event.body));

    let json = JSON.parse(event.body);

    let markets = await distamarkets.findMarkets(json.filter, json.options);

    return {
        statusCode: 200,
        body: JSON.stringify(markets)
    };
}

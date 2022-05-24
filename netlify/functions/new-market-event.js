const axios = require("axios");

exports.handler = async function(event, context) {
    let body = JSON.parse(event.body);

    body.events.forEach((event) => {
        event.matchReasons.forEach((obj) => {
            let { marketId, oracle, closingTime, numOutcomes } = obj.params;
            
            const response = await axios.post(
                "https://data.mongodb-api.com/app/data-dpoyr/endpoint/data/beta/action/insertOne",
                {
                    "dataSource": "Cluster0",
                    "database": "distamarkets",
                    "collection": "markets",
                    "document": {
                        marketId,
                        oracle,
                        closingTime,
                        numOutcomes
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Request-Headers": "*",
                        "api-key": process.env.DATA_API_KEY
                    }
                }
            );

            console.log(response.status, response.data);
        });
    });
    return {
        statusCode: 200,
        body: "OK"
    };
}

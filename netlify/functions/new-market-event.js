const {MongoClient} = require('mongodb');

exports.handler = async function(event, context) {
    console.log("body", event.body);
    console.log("parsed", JSON.parse(event.body));

    return {
        statusCode: 200,
        body: "OK"
    };
}

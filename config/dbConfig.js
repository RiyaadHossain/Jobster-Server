const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URL;

client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

exports.db = client.db("Elite-Recruit");
const mongo = require("mongodb").MongoClient;
const util = require("util");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleepFor( sleepDuration ){
    let now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

class MongoService{
    constructor(url, dbName){
        this.url = url;
        this.dbName = dbName;
        this.connect();
    }

    connect(){
        const connect = util.promisify(mongo.connect);
        connect(this.url)
            .then((client)=>{
                this.client = client;
                this.db = this.client.db(this.dbName);
            })
            .catch((err)=>{
                console.log(err);
                process.exit(1);
            });
    }

    disconnect(){
        this.client.close();
    }

    async getResults(){
        return await this.db.collection("results").find().toArray();
    }
    async insertResult(result){
        let resp = await this.db.collection("results").insertOne(result);
        return resp.insertedCount === 1;
    }
}

module.exports = MongoService;
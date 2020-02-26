const express = require('express');
const bodyParser = require("body-parser");
const dbService = require("./MongoService");
var path = require("path");
const db = new dbService("mongodb://localhost:27017/typespeed", "typespeed");

const port = 1025;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/../client/typespeed/build")));
//not a particularly good idea to do this but it is ok in this case
app.use(express.static(path.join(__dirname, "./public")));

app.get("/results", (req, resp)=>{
    db.getResults()
        .then((r)=>{
            resp.send(r);
        })
        .catch((err)=>{
            resp.status(500).send("failed to get results");
        });
});

app.post("/results", (req, resp)=>{
    db.insertResult(req.body.result)
        .then((success)=>{
            if(success){
                resp.send("OK!");
            }
            else{
                console.log("insert failed");
                resp.status(500).send("Insert FAILED!");
            }
        })
        .catch((err)=>{
            console.log(err);
            resp.status(500).send("Insert FAILED!");
        });
});

app.listen(port, ()=>{console.log("listening on port: " + port)});

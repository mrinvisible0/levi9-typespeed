const express = require('express');
const bodyParser = require("body-parser");
const port = 1025;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.post("/results", (req, resp)=>{
    // console.log(req);
    resp.send("cao");
});

app.listen(port, ()=>{console.log("listening on port: " + port)});

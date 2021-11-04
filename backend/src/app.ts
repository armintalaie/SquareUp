import express from "express";

const app = express();
const host: string = "localhost";
const port: number = 5000;


app.get('/', function(req, res) {
    res.send('Hello World');
})

app.listen(port, function() {
    console.log("Example app listening at http://%s:%s", host, port)
})


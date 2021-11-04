import express from "express";
import { Client, Environment } from 'square'
require("dotenv").config();

const accessTokenOne = process.env["SQUARE_ACCESS_TOKEN_ONE"];
const accessTokenTwo = process.env["SQUARE_ACCESS_TOKEN_TWO"];

export const client1 = new Client({
    environment: Environment.Sandbox,
    accessToken: accessTokenOne,
  })
  
export const client2 = new Client({
    environment: Environment.Sandbox,
    accessToken: accessTokenTwo,
})
  
async function getLoyaltyProgram(client: Client) {
    try {
        const response = await  client.loyaltyApi.retrieveLoyaltyProgram('main');
      
        console.log(response.result);
      } catch(error) {
        console.log(error);
      }
}

getLoyaltyProgram(client1);


const app = express();
const host: string = "localhost";
const port: number = 5000;


app.get('/', function(req, res) {
    res.send('Hello World');
})

app.listen(port, function() {
    console.log("Example app listening at http://%s:%s", host, port)
})



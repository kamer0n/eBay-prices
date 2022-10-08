import express from 'express';
import { getCoins, decomposeDB } from './firebase_functions.js';
import { getPrices } from './priceScrape.js';
import cors from 'cors';

const app = express()
const port = 9000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(cors());

app.get('/api', async function (req, res, next) {
  //await getPrices('gibraltar 2012 one pound');
  console.log('ere'); 
  res.json({coins :await getCoins()});
  decomposeDB();
})


app.get('/addCoin/:coin', async function (req, res, next) {
  console.log('here');
  console.log(req.params.coin);
  if (req.params){
  let search = req.params.coin;
  await getPrices(search)
  res.json({message : "success"});
  decomposeDB();
  } else {
    res.sendStatus(404);
  }
})
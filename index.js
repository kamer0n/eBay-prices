import express from 'express';
import { getCoins, decomposeDB } from './firebase_functions.js';
import { getPrices } from './priceScrape.js';

const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', async function (req, res, next) {
  //await getPrices('gibraltar 2012 one pound');

  res.send(await getCoins());
  decomposeDB();
})

app.get('/addCoin/', async function (req, res, next) {
  res.send(await getPrices('gibraltar 2012 one pound'));
  decomposeDB();
})
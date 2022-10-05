import admin from 'firebase-admin';
import * as cert from './ebay-prices-admin.js';

export function getDB() {
  const serviceAccount = cert['default'];

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ebay-prices-default-rtdb.europe-west1.firebasedatabase.app"
  });
  
  var db = admin.database();
  db.useEmulator('127.0.0.1', '9005');
  return db;
}

export function decomposeDB(db) {
  return db.goOffline();
}

export async function addCoin(db, search, coins) {
  let date = coins[0].date;
  // compile a key-value map of new data to be written
  let pendingUpdates = coins.reduce(
    (acc, coinInfo) => {
      acc[revisedRandId()] = {

        name: coinInfo.name,
        price: coinInfo.price,
        shipping: coinInfo.shipping,
        date: coinInfo.date,}
      
      return acc;
    }, {}

  );
  search = search + '/' + coins[0].date;
  // apply changes to database
  return db.ref(search).update(pendingUpdates);
}

function revisedRandId() {
  return Math.random().toString(36).replace(/[^a-zA-z0-9]+/g, '');
}


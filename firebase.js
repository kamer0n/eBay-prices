var firebase = require("firebase-admin");
var serviceAccount = require("./ebay-prices-admin.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://ebay-prices-default-rtdb.europe-west1.firebasedatabase.app"
});

var db = firebase.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

var usersRef = ref.child("users");
usersRef.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});

function addCoin(coin){
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: "https://ebay-prices-default-rtdb.europe-west1.firebasedatabase.app"
      });
    var db = firebase.database();
    var ref = db.ref("restricted_access/secret_document");
    ref.once("value", function(snapshot) {
    console.log(snapshot.val());
});
}


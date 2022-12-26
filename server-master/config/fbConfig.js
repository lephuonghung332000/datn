require("firebase/auth");
const firebase = require("firebase");
const admin = require("firebase-admin");
const credentials = require("../key.json");

const firebaseConfig = {
  apiKey: "AIzaSyAlqchcJ2WjIfAxfOMUUQfgGqhYcReSfvY",
  authDomain: "advertising-classified-6ee26.firebaseapp.com",
  projectId: "advertising-classified-6ee26",
  storageBucket: "advertising-classified-6ee26.appspot.com",
  messagingSenderId: "853272076054",
  appId: "1:853272076054:web:36874170f6df36b0417a37",
  measurementId: "G-XR31G42R35",
  databaseURL: "https://advertising-classified-default-rtdb.firebaseio.com"
};


firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: "advertising-classified-6ee26.appspot.com",
  databaseURL: "https://advertising-classified-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// Cloud storage
const firebaseStorage = admin.storage().bucket();

module.exports = { firebase, admin, db, firebaseStorage };

require("firebase/auth");
const firebase = require("firebase");
const admin = require("firebase-admin");
const credentials = require("../key.json");

const firebaseConfig = {
  apiKey: "AIzaSyAQQtOlAhGEudcslxkFqoCO_5s-nFrp078",
  authDomain: "advertising-classified.firebaseapp.com",
  databaseURL: "https://advertising-classified-default-rtdb.firebaseio.com",
  projectId: "advertising-classified",
  messagingSenderId: "257214432280",
  appId: "1:257214432280:web:9a54a8edb60911ebe7af6d",
  measurementId: "G-WHH7TRJVF2",
};

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://advertising-classified-default-rtdb.firebaseio.com",
  storageBucket: "advertising-classified.appspot.com",
});

const db = admin.firestore();

// Cloud storage
const firebaseStorage = admin.storage().bucket();

module.exports = { firebase, admin, db, firebaseStorage };

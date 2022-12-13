const { firebase, admin, db } = require("../config/fbConfig");

module.exports = async function isAdmin() {
  var currentUser = firebase.auth().currentUser;
  if(!currentUser){
    return false
  }
  const id = currentUser.uid
  const user = await db.collection("user").doc(id).get();
  if (user.data().role === "admin") return true;
  console.log(user.data());
  return false;
};
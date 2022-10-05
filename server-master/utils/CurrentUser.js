const { firebase,db } = require("../config/fbConfig");

module.exports = async function getCurrentUser() {
  var currentUser = await firebase.auth().currentUser;
  if (!currentUser) {
    return null;
  }
  const id = currentUser.uid
  const user = await db.collection("user").doc(id).get();
  return user;
};

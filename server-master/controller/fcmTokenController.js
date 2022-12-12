const { db } = require("../config/fbConfig");

async function getAllToken() {
  try {
    const tokens = db.collection("tokens");
    const data = await tokens.get();
    const tokensArray = [];
    if (data.empty) {
      return [];
    }
    data.forEach((doc) => {
      const token = doc.data().token;
      tokensArray.push(token);
    });
    return tokensArray;
  } catch (error) {
    return [];
  }
}

async function getTokensByUserId(user_id) {
  try {
    const tokens = db.collection("tokens");
    const data = await tokens.where("user_id", "==", user_id).get();
    const tokensArray = [];
    if (data.empty) {
      return [];
    }
    data.forEach((doc) => {
      const token = doc.data().token;
      tokensArray.push(token);
    });
    return tokensArray;
  } catch (error) {
    return [];
  }
}

async function getAllUserIds() {
  try {
    const users = db.collection("user");
    const data = await users.get();
    const ids = [];
    if (data.empty) {
      return [];
    }
    data.forEach((doc) => {
      ids.push(doc.id);
    });
    return ids;
  } catch (error) {
    return [];
  }
}

module.exports = {
  getAllToken,
  getAllUserIds,
  getTokensByUserId,
};

const { firebase, admin } = require("../config/fbConfig");

const authorMiddleware = async (req, res, next) => {
  if(!req.header("Authorization")){
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = req.header("Authorization").replace("Bearer", "").trim();
  var user = await firebase.auth().currentUser;
  try {
    if (user) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      if (decodedToken.uid === user.uid) {
        req.user = user.uid;
        return next();
      }
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (e) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = authorMiddleware

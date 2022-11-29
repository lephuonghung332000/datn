const { firebase, admin, db } = require("../config/fbConfig");

//Checks that the email passed in is an existing user
async function checkIfUserWithEmailExists(email) {
  const userCollectionRef = admin.firestore().collection("user");
  const querySnapshot = await userCollectionRef
    .where("email", "==", email)
    .get();

  return querySnapshot.size >= 1;
}

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ succes: false, message: "Email or password is empty" });
  }

  const isExist = await checkIfUserWithEmailExists(req.body.email);
  if (isExist) {
    return res
      .status(400)
      .json({ success: false, message: "This account already exist" });
  }
  try {
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(req.body.email, req.body.password);
    const newUser = {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      address: req.body.address,
      fullname: req.body.fullname,
      birthday: (Date(req.body.birthday).getTime() / 1000),
      createAt: (new Date().getTime() / 1000),
      role: "user",
      fcmTokens: [],
      avatar: 'https://firebasestorage.googleapis.com/v0/b/advertising-classified.appspot.com/o/user%2Favatar_default.png?alt=media&token=ecdcff38-dea8-4ffe-acfe-513532823d8d',
    };
    if (data) {
      const idToken = await firebase.auth().currentUser.getIdToken(true);
      const usersDb = db.collection("user");
      await usersDb.doc(data.user.uid).set(newUser);
      return res.status(201).json({
        success: true,
        message: "Register successfully",
        data: idToken,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Register failed" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error});
  }
};

const login = async (req, res) => {
  console.log(req.body.email );
  console.log(req.body.password );
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ succes: false, message: "Email or password is empty" });
  }
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(req.body.email, req.body.password);
    const idToken = await firebase.auth().currentUser.getIdToken(true);
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: idToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken(true); // here we force a refresh
    if (token) {
      return res.status(200).json({
        success: true,
        message: "Get new token successfully",
        data: token,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Get new token failed" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const logout = async (req, res) => {
  await firebase
    .auth()
    .signOut()
    .then(function () {
      return res.status(200).json({
        success: true,
        message: "Logout successfully",
      });
    })
    .catch(function (error) {
      return res
        .status(500)
        .json({ success: false, message: "Occur in server error" });
    });
};

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
};

const { firebase, admin, db } = require("../config/fbConfig");
const currentUser = require("../utils/CurrentUser");

//Checks that the email passed in is an existing user
async function checkIfUserWithEmailExists(email) {
  const userCollectionRef = admin.firestore().collection("user");
  const querySnapshot = await userCollectionRef
    .where("email", "==", email)
    .get();

  return querySnapshot.size >= 1;
}

function convertToDateTime(date) {
  const dateSplit = date.split("/");
  return `${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`;
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
      birthday: new Date(convertToDateTime(req.body.birthday)).getTime() / 1000,
      create_at: new Date().getTime() / 1000,
      role: "user",
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/advertising-classified.appspot.com/o/user%2Favatar_default.png?alt=media&token=ecdcff38-dea8-4ffe-acfe-513532823d8d",
    };
    if (data) {
      const idToken = await firebase.auth().currentUser.getIdToken(true);
      const usersDb = db.collection("user");
      await usersDb.doc(data.user.uid).set(newUser);
      return res.status(201).json({
        success: true,
        message: "Register successfully",
        data: {
          id: data.user.uid,
          token: idToken,
        },
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Register failed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const login = async (req, res) => {
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
    const id = await firebase.auth().currentUser.uid;
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        id: id,
        token: idToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const refreshToken = async (req, res) => {
  try {
    const user_id = req.params.id;
    var current = await currentUser();
    if (!current) {
      return res.status(400).json({ succes: false, message: "No found user " });
    }
    var current_user_id = current.id;
    if (user_id !== current_user_id) {
      return res.status(400).json({ succes: false, message: "No found user " });
    }
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

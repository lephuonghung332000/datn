const { admin, db, firebaseStorage } = require("../config/fbConfig");
const User = require("../models/User");

const isAdmin = require("../utils/CheckRole");
const currentUser = require("../utils/CurrentUser");

function convertToDateTime(date) {
  const dateSplit = date.split("/");
  return `${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`;
}

async function updateExtra(req, res, file) {
  const user = await currentUser();
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Can't not find user" });
  }
  const user_id = user.id;
  // try {
  const updateUser = new Object();
  if (req.body.email) {
    updateUser.email = req.body.email;
  }

  if (req.body.name) {
    updateUser.name = req.body.name;
  }

  if (req.body.phone) {
    updateUser.phone = req.body.phone;
  }

  if (req.body.gender) {
    updateUser.gender = (req.body.gender === 'true');
  }

  if (req.body.address) {
    updateUser.address = req.body.address;
  }

  if (req.body.fullname) {
    updateUser.fullname = req.body.fullname;
  }

  if (req.body.birthday) {
    updateUser.birthday =
      new Date(convertToDateTime(req.body.birthday)).getTime() / 1000;
  }

  if (file) {
    updateUser.avatar = file;
  }
  const data = admin.auth().updateUser(user_id, {
    email: req.body.email,
  });
  if (data) {
    const user = db.collection("user").doc(user_id);
    const response = await user.update(updateUser);
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Update profile successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Update failed" });
    }
  } else {
    return res.status(400).json({ success: false, message: "Update failed" });
  }
  // } catch (e) {
  //   return res
  //     .status(500)
  //     .json({ success: false, message: "Occur in server error" });
  // }
}

const updateUser = async (req, res) => {
  var file = req.file;
  if (!file) {
    updateExtra(req, res, null);
    return;
  }
  // Format the filename
  const timestamp = Date.now();
  const path = "user/";
  const name = file.originalname.split(".")[0];
  const type = file.originalname.split(".")[1];
  const fileName = `${path}${name}_${timestamp}.${type}`;

  const blob = firebaseStorage.file(fileName);

  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobWriter.on("error", (err) => {});

  blobWriter.on("finish", async () => {
    const options = {
      action: "read",
      expires: "03-17-2025",
    };

    // Get a signed URL for the file
    const signedUrlArray = await blob.getSignedUrl(options);
    updateExtra(req, res, signedUrlArray[0]);
  });
  blobWriter.end(file.buffer);
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    admin
      .auth()
      .deleteUser(id)
      .then(async function () {
        const user = db.collection("user").doc(id);
        const response = await user.delete();
        if (response) {
          return res
            .status(200)
            .json({ success: true, message: "Delete user successfully" });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Delete user failed" });
        }
      })
      .catch(function (error) {
        return res
          .status(400)
          .json({ success: false, message: "Delete user failed" });
      });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const updateRole = async (req, res) => {
  const user = await currentUser();
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Can't not find user" });
  }
  const user_id = user.id;
  const role = req.body.role;
  try {
    const checkAdmin = await isAdmin();
    if (!checkAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Only admin can do it" });
    }
    if (role !== "admin" && role !== "user") {
      return res
        .status(400)
        .json({ success: false, message: "Role is not exist" });
    }
    await admin
      .auth()
      .setCustomUserClaims(user_id, { role: role })
      .then(async function () {
        const response = await db
          .collection("user")
          .doc(user_id)
          .update({ role: role });
        if (response) {
          return res
            .status(200)
            .json({ success: true, message: "Update role successfully" });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Update role failed" });
        }
      })
      .catch(function (error) {
        return res
          .status(400)
          .json({ success: false, message: "Update role failed" });
      });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await currentUser();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Can't not find user" });
    }
    if (!user.exists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      const result = user.data();
      result["id"] = user.id;
      return res.status(200).json({
        success: true,
        message: "Get user successfully",
        data: result,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const getUserById = async (req, res) => {
  var id = req.params.id;
  try {
    const user = await db.collection("user").doc(id).get();
    if (user) {
      const result = user.data();
      result["id"] = id;
      return res.status(200).json({
        success: true,
        message: "Get user successfully",
        data: result,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Get user failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = db.collection("user");
    const data = await users.get();
    const userArray = [];
    if (data.empty) {
      return res
        .status(200)
        .json({ success: true, message: "Fetch user successful", data: [] });
    }
    data.forEach((doc) => {
      const user = new User(
        doc.id,
        doc.data().name,
        doc.data().fullname,
        doc.data().email,
        doc.data().birthday,
        doc.data().avatar,
        doc.data().phone,
        doc.data().address,
        doc.data().gender,
        doc.data().role,
        doc.data().create_at
      );
      userArray.push(user);
    });
    return res.status(200).json({
      success: true,
      message: "Fetch user successful",
      data: userArray,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  getAllUser,
  getCurrentUser,
  getUserById,
  updateUser,
  updateRole,
  deleteUser,
};

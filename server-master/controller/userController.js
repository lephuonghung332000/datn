const { admin, db, firebaseStorage } = require("../config/fbConfig");

const isAdmin = require("../utils/CheckRole");
const currentUser = require("../utils/CurrentUser");

async function updateExtra(req, res, file) {
  const user = await currentUser();
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Can't not find user" });
  }
  const user_id = user.id;
  try {
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
      updateUser.gender = req.body.gender;
    }

    if (req.body.address) {
      updateUser.address = req.body.address;
    }

    if (req.body.fullname) {
      updateUser.fullname = req.body.fullname;
    }

    if (req.body.birthday) {
      updateUser.birthday = new Date(req.body.birthday).valueOf();
    }

    if (file) {
      updateUser.file = file;
    }
    const data = admin.auth().updateUser(id, {
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
        return res
          .status(400)
          .json({ success: false, message: "Update failed" });
      }
    } else {
      return res.status(400).json({ success: false, message: "Update failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
}

const updateUser = async (req, res) => {
  var file = req.file;
  if (!file) {
    updateExtra(req, res, null);
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

const getUser = async (req, res) => {
  try {
    const user = await currentUser();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Can't not find user" });
    }
    if (!user.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    } else {
      return res.status(200).json(user.data());
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const updateFCMTokens = async (req, res) => {
  const user = await currentUser();
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Can't not find user" });
  }
  const user_id = user.id;
  const fcmTokens = req.body.fcmTokens;
  try {
    const response = await db
      .collection("user")
      .doc(user_id)
      .update({ fcmTokens: fcmTokens });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Update fcmTokens successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Update fcmTokens failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getUser,
  updateUser,
  updateRole,
  deleteUser,
  updateFCMTokens,
};

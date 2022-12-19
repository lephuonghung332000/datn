const express = require("express");
const {
  getAllUser,
  getCurrentUser,
  getUserById,
  updateUser,
  updateRole,
  deleteUser,
} = require("../controller/userController");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

const router = express.Router();

router.get("/all", getAllUser);
router.get("/", getCurrentUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.patch("/update/:id", upload, updateUser);
router.patch("/update/role/:id", updateRole);

module.exports = {
  routes: router,
};

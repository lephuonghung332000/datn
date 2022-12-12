const express = require("express");
const {
  getAllUser,
  getCurrentUser,
  getUserById,
  updateUser,
  updateRole,
  deleteUser,
} = require("../controller/userController");
const userMiddleware = require("../middleware/author");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

const router = express.Router();

router.get("/all", userMiddleware, getAllUser);
router.get("/", userMiddleware, getCurrentUser);
router.get("/:id", getUserById);
router.delete("/:id", userMiddleware, deleteUser);
router.patch("/update", userMiddleware, upload, updateUser);
router.patch("/update/role/:id", updateRole);

module.exports = {
  routes: router,
};

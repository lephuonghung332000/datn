const express = require("express");
const userMiddleware = require("../middleware/author");
const {
  getAllBrand,
  createBrand,
  deleteBrand,
} = require("../controller/brandController");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");
const router = express.Router();

router.get("/", getAllBrand);
router.post("/addBrand", upload, createBrand);
router.delete("/deleteBrand/:id", deleteBrand);

module.exports = {
  routes: router,
};

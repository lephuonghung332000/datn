const express = require("express");
const userMiddleware = require("../middleware/author");
const {
  getAllBrand,
  createBrand,
  deleteBrand,
} = require("../controller/brandController");

const router = express.Router();

router.get("/", getAllBrand);
router.post("/addBrand", createBrand);
router.delete("/deleteBrand/:id", deleteBrand);

module.exports = {
  routes: router,
};

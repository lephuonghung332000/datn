const express = require("express");
const userMiddleware = require("../middleware/author");
const {
  getAllBranch,
  createBranch,
  deleteBranch,
} = require("../controller/branchController");

const router = express.Router();

router.get("/", getAllBranch);
router.post("/addBranch", createBranch);
router.delete("/deleteBranch/:id", deleteBranch);

module.exports = {
  routes: router,
};

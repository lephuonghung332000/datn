const express = require("express");
const userMiddleware = require("../middleware/author");
const {
  getAllHistorySearch,
  addSearchHistory,
} = require("../controller/searchController");

const router = express.Router();

router.get("/", userMiddleware, getAllHistorySearch);
router.post("/addSearch", addSearchHistory);

module.exports = {
  routes: router,
};

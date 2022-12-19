const express = require("express");
const {
  getAllHistorySearch,
  addSearchHistory,
} = require("../controller/searchController");

const router = express.Router();

router.get("/:id", getAllHistorySearch);
router.post("/addSearch", addSearchHistory);

module.exports = {
  routes: router,
};

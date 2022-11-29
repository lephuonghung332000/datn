const express = require("express");
const { getAllProvinces } = require("../controller/countryController");

const router = express.Router();

router.get("/province", getAllProvinces);

module.exports = {
  routes: router,
};

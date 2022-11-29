const express = require("express");
const { getAllProvinces } = require("../controller/countryController");

const router = express.Router();

router.get("/province", getAllProvinces);
router.get("/district/:province_id", getAllProvinces);

module.exports = {
  routes: router,
};

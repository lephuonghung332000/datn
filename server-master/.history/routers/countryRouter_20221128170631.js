const express = require("express");
const {
  getAllProvinces,
  getDistrict,
} = require("../controller/countryController");

const router = express.Router();

router.get("/province", getAllProvinces);
router.get("/district/:province_id", getDistrict);

module.exports = {
  routes: router,
};

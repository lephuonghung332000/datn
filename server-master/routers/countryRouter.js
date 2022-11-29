const express = require("express");
const {
  getAllProvinces,
  getDistrict,
  getWard,
} = require("../controller/countryController");

const router = express.Router();

router.get("/", getAllProvinces);
router.get("/district/:province_id", getDistrict);
router.get("/ward/:district_id", getWard);
module.exports = {
  routes: router,
};

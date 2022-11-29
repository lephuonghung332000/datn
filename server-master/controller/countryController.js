const axios = require("axios");
const COUNTRY_BASE_URL = "https://vapi.vnappmob.com/api/";
const getAllProvinces = async (req, res) => {
  const options = {
    method: "GET",
    url: `${COUNTRY_BASE_URL}province`,
  };
  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const getDistrict = async (req, res) => {
  var province_id = req.params.province_id;
  const options = {
    method: "GET",
    url: `${COUNTRY_BASE_URL}province/district/${province_id}`,
  };
  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const getWard = async (req, res) => {
  var district_id = req.params.district_id;
  const options = {
    method: "GET",
    url: `${COUNTRY_BASE_URL}province/ward/${district_id}`,
  };
  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  getAllProvinces,
  getDistrict,
  getWard
};

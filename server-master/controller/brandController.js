const { db, firebaseStorage } = require("../config/fbConfig");

const Brand = require("../models/Brand");

const getAllBrand = async (req, res) => {
  try {
    const brand = db.collection("brand");
    const data = await brand.get();
    const brandArray = [];
    if (data.empty) {
      return res.status(200).json({ success: true, data: [] });
    }
    data.forEach((doc) => {
      const brand = new Brand(doc.id, doc.data().name);
      brandArray.push(brand);
    });
    return res.status(200).json({ success: true, data: brandArray });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const createBrand = async (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to field name" });
  }
  try {
    const brandDb = db.collection("brand");
    const response = await brandDb.doc().set({ name: name });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Add brand successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Add brand failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const deleteBrand = async (req, res) => {
  const id = req.params.id;
  try {
    const brand = db.collection("brand").doc(id);
    const response = await brand.delete();
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Delete brand successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Delete brand failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllBrand,
  createBrand,
  deleteBrand,
};

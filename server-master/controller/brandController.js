const { db, firebaseStorage } = require("../config/fbConfig");

const Brand = require("../models/Brand");

const getAllBrand = async (req, res) => {
  try {
    const brand = db.collection("brand");
    const data = await brand.get();
    const brandArray = [];
    if (data.empty) {
      return res
        .status(200)
        .json({ success: true, message: "Fetch brand succesfully", data: [] });
    }
    data.forEach((doc) => {
      const brand = new Brand(doc.id, doc.data().name, doc.data().image);
      brandArray.push(brand);
    });
    return res.status(200).json({
      success: true,
      message: "Fetch brand succesfully",
      data: brandArray,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const createBrand = async (req, res) => {
  var file = req.file;
  if (!file) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to upload file" });
  }
  const name = req.body.name;
  if (!name) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to field name" });
  }
  // Format the filename
  const timestamp = Date.now();
  const path = "brand/";
  const brandName = file.originalname.split(".")[0];
  const type = file.originalname.split(".")[1];
  const fileName = `${path}${brandName}_${timestamp}.${type}`;

  const blob = firebaseStorage.file(fileName);

  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobWriter.on("error", (err) => {});

  blobWriter.on("finish", async () => {
    const options = {
      action: "read",
      expires: "03-17-2025",
    };

    // Get a signed URL for the file
    try {
      const signedUrlArray = await blob.getSignedUrl(options);
      const brandDb = db.collection("brand");
      const response = await brandDb.doc().set({
        image: signedUrlArray[0],
        name: name,
      });
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
  });
  blobWriter.end(file.buffer);
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

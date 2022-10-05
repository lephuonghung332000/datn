const { db ,firebaseStorage} = require("../config/fbConfig");

const Category = require("../models/Category");

const getAllCategories = async (req, res) => {
  try {
    const category = db.collection("category");
    const data = await category.get();
    const categoryArray = [];
    if (data.empty) {
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const category = new Category(doc.id, doc.data().name,doc.data().thumbnail);
      categoryArray.push(category);
    });
    return res.status(200).json(categoryArray);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};


const addCategory = async (req, res) => {
  var file = req.file;
  if (!file) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to upload file" });
  }
  if (!req.body.name) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field name" });
  }
  // Format the filename
  const timestamp = Date.now();
  const path = "category/";
  const name = file.originalname.split(".")[0];
  const type = file.originalname.split(".")[1];
  const fileName = `${path}${name}_${timestamp}.${type}`;

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
    try{
      const signedUrlArray = await blob.getSignedUrl(options);
      const categoryDb = db.collection("category");
      const response = await categoryDb.doc().set({image: signedUrlArray[0],name:req.body.name});
      if (response) {
        return res
          .status(200)
          .json({ success: true, message: "Add category successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Add category failed" });
      }
    } catch(e){
      return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
    }
   
  });
  blobWriter.end(file.buffer);
};


module.exports = {
  getAllCategories,
  addCategory
};

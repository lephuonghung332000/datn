const { db, firebaseStorage } = require("../config/fbConfig");
const sendNotifications = require("../controller/sendNotification");
const Ads = require("../models/Ads");

const getAllAds = async (req, res) => {
  try {
    const ads = db.collection("advertising");
    const data = await ads.get();
    const adsArray = [];
    if (data.empty) {
      return res
        .status(200)
        .json({ success: true, message: "Fetch ads successful", data: [] });
    }
    data.forEach((doc) => {
      const ads = new Ads(
        doc.id,
        doc.data().image,
        doc.data().title,
        doc.data().url,
        doc.data().content
      );
      adsArray.push(ads);
    });
    return res
      .status(200)
      .json({ success: true, message: "Fetch ads successful", data: adsArray });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

function sendCreateAds(body) {
  sendNotifications(body,null, "ads",null);
}

const createAds = async (req, res) => {
  var file = req.file;
  if (!file) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to upload file" });
  }
  if (!req.body.title) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field title" });
  }
  if (!req.body.content) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field content" });
  }
  if (!req.body.url) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field url" });
  }
  // Format the filename
  const timestamp = Date.now();
  const path = "ads/";
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
    try {
      const signedUrlArray = await blob.getSignedUrl(options);
      const adsDb = db.collection("advertising");
      const response = await adsDb.doc().set({
        image: signedUrlArray[0],
        title: req.body.title,
        content: req.body.content,
        url: req.body.url,
      });
      if (response) {
        sendCreateAds(req.body);
        return res
          .status(200)
          .json({ success: true, message: "Add ads successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Add ads failed" });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: "Occur in server error" });
    }
  });
  blobWriter.end(file.buffer);
};

const deleteAds = async (req, res) => {
  const id = req.params.id;
  try {
    const ads = db.collection("advertising").doc(id);
    const response = await ads.delete();
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Delete ads successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Delete ads failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  createAds,
  getAllAds,
  deleteAds,
};

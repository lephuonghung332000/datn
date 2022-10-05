const { db, firebaseStorage } = require("../config/fbConfig");

const Brand = require("../models/Brand");

const getAllBranch = async (req, res) => {
  try {
    const branch = db.collection("branch");
    const data = await branch.get();
    const branchArray = [];
    if (data.empty) {
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const branch = new Brand(doc.id, doc.data().name);
      branchArray.push(branch);
    });
    return res.status(200).json(branchArray);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const createBranch = async (req, res) => {
    const name = req.body.name
    if (!name) {
      return res
        .status(400)
        .json({ succes: false, message: "Need to field name" });
    }
    try {
      const branchDb = db.collection("branch");
      const response = await branchDb.doc().set({ name: name});
      if (response) {
        return res
          .status(200)
          .json({ success: true, message: "Add branch successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Add branch failed" });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: "Occur in server error" });
    }
};

const deleteBranch = async (req, res) => {
  const id = req.params.id;
  try {
    const branch = db.collection("branch").doc(id);
    const response = await branch.delete();
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Delete branch successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Delete branch failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllBranch,
  createBranch,
  deleteBranch
};

const { db } = require("../config/fbConfig");
const SearchHistory = require("../models/SearchHistory");
const currentUser = require("../utils/CurrentUser");

const getAllHistorySearch = async (req, res) => {
  try {
    const user = await currentUser();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Can't not find user" });
    }
    const user_id = user.id;
    const searchs = db
      .collection("search_history")
      .where("user_id", "==", user_id)
      .orderBy("create_at","desc")
      .limit(10);
    const data = await searchs.get();
    const searchArray = [];
    if (data.empty) {
      return res.status(200).json({
        success: true,
        message: "Fetch search history successful",
        data: [],
      });
    }
    data.forEach((doc) => {
      const search = new SearchHistory(
        doc.id,
        doc.data().key,
        doc.data().user_id,
        doc.data().create_at
      );
      searchArray.push(search);
    });
    return res.status(200).json({
      success: true,
      message: "Fetch search history successful",
      data: searchArray,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const addSearchHistory = async (req, res) => {
  if (!req.body.key) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to field key" });
  }

  if (!req.body.user_id) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field user id" });
  }
  try {
    const searchDb = db.collection("search_history");
    const searchs = db
      .collection("search_history")
      .where("key", "==", req.body.key)
    const data = await searchs.get();
    if(data.empty){
      return res
      .status(400)
      .json({ succes: false, message: "Already existed this key" });
    }
    const response = await searchDb
      .doc()
      .set({
        key: req.body.key,
        user_id: req.body.user_id,
        create_at: new Date().getTime() / 1000,
      });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Add search history successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Add search history failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllHistorySearch,
  addSearchHistory,
};

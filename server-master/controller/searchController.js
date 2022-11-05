const { db } = require("../config/fbConfig");
const SearchHistory = require("../models/SearchHistory");
const currentUser = require("../utils/CurrentUser");

const getAllHistorySearch = async (req, res) => {
  // try {
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
      .orderBy("create_at")
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
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ success: false, message: "Occur in server error" });
  // }
};

module.exports = {
  getAllHistorySearch,
};

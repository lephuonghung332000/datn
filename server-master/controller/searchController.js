const { db } = require("../config/fbConfig");
const SearchHistory = require("../models/SearchHistory");

const getAllHistorySearch = async (req, res) => {
  try {
    const id = req.params.id;
    const searchs = db.collection("search_history").where("user_id","==",id);
    const data = await searchs.get();
    const searchArray = [];
    if(data.empty){
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const search = new SearchHistory(
        doc.id,
        doc.data().key,
        doc.data().user_id,
        doc.data().create_at,
      );
      searchArray.push(search);
    });
    return res.status(200).json(searchArray);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllHistorySearch
};

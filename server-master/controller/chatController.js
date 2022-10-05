const { db } = require("../config/fbConfig");

const HintChat = require("../models/HintChat");

const getAllHintChats = async (req, res) => {
  try {
    const hintChats = db.collection("hint_chat");
    const data = await hintChats.get();
    const hintChatsArray = [];
    if(data.empty){
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const hintChat = new HintChat(
        doc.id,
        doc.data().content,
      );
      hintChatsArray.push(hintChat);
    });
    return res.status(200).json(hintChatsArray);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error });
  }
};

module.exports = {
    getAllHintChats
};

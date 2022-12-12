const { db } = require("../config/fbConfig");
const PAGE_SIZE = 2;
const HintChat = require("../models/HintChat");
const Chat = require("../models/Chat");
const currentUser = require("../utils/CurrentUser");
const User = require("../models/User");

const getAllHintChats = async (req, res) => {
  try {
    const hintChats = db.collection("hint_chat");
    const data = await hintChats.get();
    const hintChatsArray = [];
    if (data.empty) {
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const hintChat = new HintChat(doc.id, doc.data().content);
      hintChatsArray.push(hintChat);
    });
    return res.status(200).json(hintChatsArray);
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const getAllChats = async (req, res) => {
  var page = req.query.page;
  var lengthChat;
  var data;
  try {
    var current = await currentUser();
    if (!current) {
      return res.status(400).json({ succes: false, message: "No found user " });
    }
    var user_id = current.id;
    if (page) {
      // get page
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      if (page == 1) {
        data = await queryChat(user_id, PAGE_SIZE, null);
      } else {
        var start = (page - 1) * PAGE_SIZE;

        const snapshot = await queryChat(user_id, start, null);

        if (snapshot.docs.length < start) {
          data = [];
        } else {
          // Get the last document
          var last = snapshot.docs[snapshot.docs.length - 1];

          data = await queryChat(user_id, PAGE_SIZE, last.data().create_at);
        }
      }
      // don't pass page
    } else {
      data = await queryChat(user_id, null, null);
    }

    const chatsArray = [];
    if (data.empty || data.docs == undefined) {
      return res.status(200).json({
        success: true,
        message: "Fetch chat successfully",
        total: 0,
        data: [],
      });
    }
    var allchats = await queryChat(user_id, null, null);
    lengthChat = allchats.docs.length;
    var users = [];
    const user_ids = data.docs.map((doc) => {
      if (doc.data().id_receiver === user_id) return doc.data().id_sender;
      return doc.data().id_receiver;
    });

    const futureUserDataGroup = user_ids.map(async (id) => {
      var userData = (await db.collection("user").doc(id).get()).data();
      userData["id"] = id;
      return userData;
    });
    users = await Promise.all(futureUserDataGroup);

    var posts = [];
    const post_ids = data.docs
      .map((doc) => {
        return doc.data().post_id;
      })
      .filter(onlyUnique);
    const futurePostDataGroup = post_ids.map(async (id) => {
      var postData = (await db.collection("post").doc(id).get()).data();
      postData["id"] = id;
      return postData;
    });
    posts = await Promise.all(futurePostDataGroup);

    for (var i = 0; i < data.docs.length; i++) {
      const chat = new Chat(
        data.docs[i].id,
        data.docs[i].data().id_receiver,
        data.docs[i].data().id_sender,
        data.docs[i].data().create_at,
        data.docs[i].data().post_id
      );
      chat["avatar"] = users[i].avatar;
      chat["fullname"] = users[i].fullname;
      chat["post_title"] = posts[i].title;
      chatsArray.push(chat);
    }
    return res.status(200).json({
      success: true,
      message: "Fetch chat successfully",
      total: lengthChat,
      data: chatsArray,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function queryChat(user_id, limit, start) {
  var data = db.collection("chat");
  if (user_id) {
    data = data.where("users", "array-contains", user_id);
  }
  data = data.orderBy("create_at", "desc");
  if (start) {
    data = data.startAfter(start);
  }
  if (limit) {
    data = data.limit(limit);
  }
  return await data.get();
}
module.exports = {
  getAllHintChats,
  getAllChats,
};

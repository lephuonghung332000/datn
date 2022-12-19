const { db } = require("../config/fbConfig");
const PAGE_SIZE = 10;
const HintChat = require("../models/HintChat");
const Chat = require("../models/Chat");

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
  const user_id = req.params.id;
  var lengthChat;
  var data;
  try {
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
      chat["post_price"] = posts[i].price;
      chat["post_image"] = posts[i].images[0];
      chat["user_id"] = users[i].id;
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

const addChat = async (req, res) => {
  if (!req.body.id_receiver) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to field id receiver" });
  }

  if (!req.body.id_sender) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to field id sender" });
  }

  if (!req.body.post_id) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field post" });
  }

  try {
    const chatDb = db.collection("chat");
    const users = [req.body.id_sender, req.body.id_receiver];
    const chats = db
      .collection("chat")
      .where("post_id", "==", req.body.post_id)
      .where("id_receiver", "==", req.body.id_receiver)
      .where("id_sender", "==", req.body.id_sender);
    const data = await chats.get();
    const chatsArray = [];
    for (var i = 0; i < data.docs.length; i++) {
      const chat = new Chat(
        data.docs[i].id,
        data.docs[i].data().id_receiver,
        data.docs[i].data().id_sender,
        data.docs[i].data().create_at,
        data.docs[i].data().post_id
      );
      chatsArray.push(chat);
    }

    if (!data.empty) {
      return res.status(200).json({
        success: false,
        message: "Already existed this chat",
        data: chatsArray[0].id,
      });
    }
    const response = await chatDb.add({
      id_receiver: req.body.id_receiver,
      id_sender: req.body.id_sender,
      post_id: req.body.post_id,
      users: users,
      create_at: new Date().getTime() / 1000,
    });
    if (response) {
      return res.status(200).json({
        success: true,
        message: "Add chat successfully",
        data: response.id,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Add chat failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const createMessageChat = async (req, res) => {
  var file = req.file;

  if (!req.body.chat_box_id) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field chat id" });
  }
  if (!req.body.sendBy) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field sender" });
  }
  if (!req.body.content) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field message" });
  }
  if (!req.body.create_at) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field create time" });
  }

  if (!file) {
    updateExtra(req, res, null);
    return;
  }

  // Format the filename
  const timestamp = Date.now();
  const path = "chat/";
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
    const signedUrlArray = await blob.getSignedUrl(options);
    updateExtra(req, res, signedUrlArray[0]);
  });
  blobWriter.end(file.buffer);
};

async function updateExtra(req, res, file) {
  try {
    const messageChatDb = db.collection("message_chat");
    const response = await messageChatDb.doc().set({
      image: file,
      title: req.body.title,
      content: req.body.content,
      url: req.body.url,
    });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Add message chat successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Add message chat failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
}
module.exports = {
  getAllHintChats,
  getAllChats,
  addChat,
  createMessageChat
};

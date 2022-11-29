const { db, firebaseStorage } = require("../config/fbConfig");
const Comment = require("../models/Comment");

const PAGE_SIZE = 3;

const getAllComment = async (req, res) => {
  var post_id = req.params.id;
  var page = req.query.page;
  var lengthComment;

  var data;
  try {
  if (!post_id) {
    return res
      .status(400)
      .json({ succes: false, message: "No found comment for post" });
  }

  if (page) {
    // get page
    page = parseInt(page);
    if (page < 1) {
      page = 1;
    }
    if (page == 1) {
      data = await queryComment(post_id, PAGE_SIZE, null);
    } else {
      var start = (page - 1) * PAGE_SIZE;

      const snapshot = await queryComment(post_id, start, null);

      if (snapshot.docs.length < start) {
        data = [];
      } else {
        // Get the last document
        var last = snapshot.docs[snapshot.docs.length - 1];

        data = await queryComment(post_id, PAGE_SIZE, last.data().create_at);
      }
    }
    // don't pass page
  } else {
    data = await queryComment(post_id, null, null);
  }
  const commentArray = [];
  if (data.empty || data.docs == undefined) {
    return res
      .status(200)
      .json({
        success: true,
        message: "Fetch comment successfully",
        total: 0,
        data: [],
      });
  }
  var allComment = await queryComment(post_id, null, null);
  lengthComment = allComment.docs.length;
  var users = [];
  const ids = data.docs
    .map((doc) => {
      return doc.data().user_id;
    })
    .filter(onlyUnique);
  const futureUserDataGroup = ids.map(async (id) => {
    var userData = (await db.collection("user").doc(id).get()).data();
    userData["id"] = id;
    return userData;
  });
  users = await Promise.all(futureUserDataGroup);
  data.forEach((doc) => {
    const comment = new Comment(
      doc.id,
      doc.data().post_id,
      doc.data().user_id,
      doc.data().content,
      doc.data().create_at
    );
    const selectedUser = users.find(function (e) {
      return e.id == doc.data().user_id;
    });
    comment["avatar"] = selectedUser.avatar;
    comment["fullname"] = selectedUser.fullname;
    commentArray.push(comment);
  });
  return res.status(200).json({
    success: true,
    message: "Fetch comment successfully",
    total: lengthComment,
    data: commentArray,
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

async function queryComment(post_id, limit, start) {
  var data = db.collection("comment");
  if (post_id) {
    data = data.where("post_id", "==", post_id);
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

const addComment = async (req, res) => {
  if (!req.body.user_id) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field user" });
  }

  if (!req.body.post_id) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field post" });
  }

  if (!req.body.content) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field content" });
  }

  const newComment = {
    user_id: req.body.user_id,
    post_id: req.body.post_id,
    content: req.body.content,
    create_at: (new Date().getTime() / 1000),
    update_at: (new Date().getTime() / 1000),
  };
  const commentDb = db.collection("comment");
  const response = await commentDb.doc().set(newComment);
  if (response) {
    return res
      .status(200)
      .json({ success: true, message: "Add comment successfully" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Add comment failed" });
  }
};

async function updateExtra(req, res) {
  try {
    const updateComment = new Object();
    if (req.body.user_id) {
      updateComment.user_id = req.body.user_id;
    }

    if (req.body.post_id) {
      updateComment.post_id = req.body.post_id;
    }

    if (req.body.content) {
      updateComment.content = req.body.content;
    }

    updateComment.update_at = (new Date().getTime() / 1000);

    const commentDb = db.collection("comment").doc(id);
    const response = await commentDb.update(updateComment);
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Update comment successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Update failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
}

const updateComment = async (req, res) => {
  updateExtra(req, res);
};

const deleteComment = async (req, res) => {
  const id = req.params.id;
  try {
    const comment = db.collection("comment").doc(id);
    const response = await comment.delete();
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Delete comment successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Delete comment failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllComment,
  addComment,
  deleteComment,
  updateComment,
};

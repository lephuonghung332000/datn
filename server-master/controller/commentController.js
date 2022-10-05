const { db, firebaseStorage } = require("../config/fbConfig");
const Comment = require("../models/Comment");

const PAGE_SIZE = 5;

const getAllComment = async (req, res) => {
  var post_id = req.params.id;
  var page = req.query.page;

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
    if (data.empty) {
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const comment = new Comment(
        doc.id,
        doc.data().post_id,
        doc.data().user_id,
        doc.data().content,
        doc.data().image,
        doc.data().create_at,
        doc.data().update_at
      );
      commentArray.push(comment);
    });
    return res.status(200).json(commentArray);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

async function queryComment(post_id, limit, start) {
  var data = db.collection("comment");
  if (post_id) {
    data = data.where("post_id", "==", post_id);
  }
  data = data.orderBy("create_at");
  if (start) {
    data = data.startAfter(start);
  }
  if (limit) {
    data = data.limit(limit);
  }
  return await data.get();
}

const addComment = async (req, res) => {
  var file = req.file;
  if (!file) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to upload file" });
  }
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

  // Format the filename
  const timestamp = Date.now();
  const path = "comment/";
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
      const newComment = {
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        content: req.body.content,
        image: signedUrlArray[0],
        create_at: new Date().valueOf(),
        update_at: new Date().valueOf(),
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
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: "Occur in server error" });
    }
  });
  blobWriter.end(file.buffer);
};

async function updateExtra(req, res, file) {
  const post_id = req.params.id;
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

    if (file) {
      updateComment.image = file;
    }

    updateComment.update_at = new Date().valueOf();

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
  var file = req.file;
  if (!file) {
    updateExtra(req, res, null);
  }

  // Format the filename
  const timestamp = Date.now();
  const path = "comment/";
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
  updateComment
};

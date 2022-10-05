const { db, firebaseStorage } = require("../config/fbConfig");
const Post = require("../models/Post");
const sendNotifications = require("../controller/sendNotification");
const currentUser = require("../utils/CurrentUser");

const isAdmin = require("../utils/CheckRole");

const PAGE_SIZE = 10;

function sendUpdatePostNotifications(tokens, title, status) {
  var message = "Tin đăng " + `${title}` + " của bạn";
  switch (status) {
    case "reject":
      message += " đã bị từ chối";
      break;
    case "accept":
      message += " đã được duyệt";
      break;
    default:
    // code block
  }
  sendNotifications(tokens, message);
}

const getAllPost = async (req, res) => {
  var user_id = req.params.id;
  var page = req.query.page;
  var status = req.query.status;

  var data;
  try {
    const checkAdmin = await isAdmin();
    if (!user_id && !checkAdmin) {
      return res
        .status(400)
        .json({ succes: false, message: "No found post for user" });
    }

    if (
      status != null &&
      status !== "pending" &&
      status !== "accept" &&
      status !== "reject"
    ) {
      return res
        .status(400)
        .json({ succes: false, message: "No found status" });
    }
    if (page) {
      // get page
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      if (page == 1) {
        data = await queryPost(user_id, status, PAGE_SIZE, null);
      } else {
        var start = (page - 1) * PAGE_SIZE;

        const snapshot = await queryPost(user_id, status, start, null);

        if (snapshot.docs.length < start) {
          data = [];
        } else {
          // Get the last document
          var last = snapshot.docs[snapshot.docs.length - 1];

          data = await queryPost(
            user_id,
            status,
            PAGE_SIZE,
            last.data().create_at
          );
        }
      }
      // don't pass page
    } else {
      data = await queryPost(user_id, status, null, null);
    }
    const postArray = [];
    if (data.empty) {
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const post = new Post(
        doc.id,
        doc.data().title,
        doc.data().create_at,
        doc.data().update_at,
        doc.data().status,
        doc.data().images,
        doc.data().user_id,
        doc.data().category_id,
        doc.data().brand,
        doc.data().address,
        doc.data().price,
        doc.data().description
      );
      postArray.push(post);
    });
    return res.status(200).json(postArray);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

async function queryPost(user_id, status, limit, start) {
  var data = db.collection("post");
  if (user_id) {
    data = data.where("user_id", "==", user_id);
  }
  if (status) {
    data = data.where("status", "==", status);
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

const createPost = async (req, res) => {
  var files = req.files;
  if (files === undefined || files.length == 0) {
    return res
      .status(400)
      .json({ succes: false, message: "Need to upload file" });
  }
  if (!req.body.title) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field title" });
  }

  if (!req.body.brand_id) {
    return res.status(400).json({ succes: false, message: "Missing field" });
  }

  if (!req.body.address) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field address" });
  }

  if (!req.body.price) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field price" });
  }

  if (!req.body.category_id) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field categor6y" });
  }

  if (!req.body.user_id) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing field user id" });
  }
  const images = [];
  files.forEach(async (file) => {
    // Format the filename
    const timestamp = Date.now();
    const path = "post/";
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
      images.push(signedUrlArray[0]);
      if (images.length === files.length) {
        const newPost = {
          user_id: req.body.user_id,
          category_id: req.body.category_id,
          title: req.body.title,
          images: images,
          create_at: new Date().valueOf(),
          update_at: new Date().valueOf(),
          status: "pending",
          brand: req.body.brand_id,
          price: req.body.price,
          address: req.body.address,
          description: req.body.description,
        };
        // add db
        try {
          const postDb = db.collection("post");
          const response = await postDb.doc().set(newPost);
          if (response) {
            return res
              .status(200)
              .json({ success: true, message: "Add post successfully" });
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Add post failed" });
          }
        } catch (e) {
          return res
            .status(500)
            .json({ success: false, message: "Occur in server error" });
        }
      }
    });
    blobWriter.end(file.buffer);
  });
};

async function updateExtra(req, res, files) {
  const id = req.params.id;
  try {
    const updatePost = new Object();
    if (req.body.title) {
      updatePost.title = req.body.title;
    }

    if (req.body.brand_id) {
      updatePost.brand_id = req.body.brand_id;
    }

    if (req.body.address) {
      updatePost.address = req.body.address;
    }

    if (req.body.price) {
      updatePost.price = req.body.price;
    }

    if (req.body.category_id) {
      updatePost.category_id = req.body.category_id;
    }

    if (req.body.description) {
      updatePost.description = req.body.description;
    }

    if (req.body.user_id) {
      updatePost.user_id = req.body.user_id;
    }

    if (files) {
      updatePost.images = files;
    }

    updatePost.update_at = new Date().valueOf();

    const postDb = db.collection("post").doc(id);
    const response = await postDb.update(updatePost);
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Update post successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Update failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
}

const updatePost = async (req, res) => {
  var files = req.files;
  if (files === undefined || files.length == 0) {
    updateExtra(req, res, null);
  }
  const images = [];
  files.forEach(async (file) => {
    // Format the filename
    const timestamp = Date.now();
    const path = "post/";
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
      images.push(signedUrlArray[0]);
      if (images.length === files.length) {
        updateExtra(req, res, images);
      }
    });
    blobWriter.end(file.buffer);
  });
};

const updateStatusPost = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  try {
    const checkAdmin = await isAdmin();
    if (!checkAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Only admin can do it" });
    }
    if (status !== "pending" && status !== "accept" && status !== "reject") {
      return res
        .status(400)
        .json({ success: false, message: "Status is not exist" });
    }
    const response = await db
      .collection("post")
      .doc(id)
      .update({ status: status });
    if (response) {
      const title = await db.collection("post").doc(id).get().title;
      const user = await currentUser();
      if (user) {
        sendUpdatePostNotifications(user.fcmTokens, title, status);
      }
      return res
        .status(200)
        .json({ success: true, message: "Update status successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Update status failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = db.collection("post").doc(id);
    const response = await post.delete();
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Delete post successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Delete post failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
  updateStatusPost,
};

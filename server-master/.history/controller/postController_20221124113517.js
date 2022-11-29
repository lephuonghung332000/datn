const { db, firebaseStorage } = require("../config/fbConfig");
const Post = require("../models/Post");
const sendNotifications = require("../controller/sendNotification");
const currentUser = require("../utils/CurrentUser");

const isAdmin = require("../utils/CheckRole");

const PAGE_SIZE = 4;

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

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function getResultPost(
  user_id,
  status,
  category_id,
  province,
  search,
  create_at,
  page,
  res
) {
  var data;
  var lengthPost;
  // try {
  if (
    status != null &&
    status !== "pending" &&
    status !== "accept" &&
    status !== "reject"
  ) {
    return res.status(400).json({ succes: false, message: "No found status" });
  }

  if (page) {
    // get page
    page = parseInt(page);
    if (page < 1) {
      page = 1;
    }
    if (page == 1) {
      data = await queryPost(
        user_id,
        status,
        category_id,
        province,
        search,
        create_at,
        PAGE_SIZE,
        null
      );
    } else {
      var start = (page - 1) * PAGE_SIZE;

      const snapshot = await queryPost(
        user_id,
        status,
        category_id,
        province,
        search,
        create_at,
        start,
        null
      );

      if (snapshot.docs.length < start) {
        data = [];
      } else {
        // Get the last document
        var last = snapshot.docs[snapshot.docs.length - 1];
        data = await queryPost(
          user_id,
          status,
          category_id,
          province,
          search,
          create_at,
          PAGE_SIZE,
          last.data().create_at
        );
      }
    }
    const total = await queryPost(
      user_id,
      status,
      category_id,
      province,
      search,
      create_at,
      null,
      null
    );
    lengthPost = total.docs.length;
    // don't pass page
  } else {
    data = await queryPost(
      user_id,
      status,
      category_id,
      province,
      search,
      create_at,
      null,
      null
    );
    lengthPost = data.docs.length;
  }
  const postArray = [];
  if (data.empty || data.docs == undefined) {
    return res.status(200).json({
      success: true,
      message: "Fetch post successfully",
      total:0,
      data: [],
    });
  }
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
    const post = new Post(
      doc.id,
      doc.data().title,
      doc.data().create_at,
      doc.data().update_at,
      doc.data().status,
      doc.data().images,
      doc.data().user_id,
      doc.data().category_id,
      doc.data().brand_id,
      doc.data().address,
      doc.data().price,
      doc.data().description
    );
    const selectedUser = users.find(function (e) {
      return e.id == doc.data().user_id;
    });
    post["avatar"] = selectedUser.avatar;
    post["name"] = selectedUser.name;
    post["phone"] = selectedUser.phone;
    post["email"] = selectedUser.email;
    post["date_join"] = selectedUser.create_at;
    postArray.push(post);
  });
  return res.status(200).json({
    success: true,
    message: "Fetch post successfully",
    total: lengthPost,
    data: postArray,
  });
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ success: false, message: "Occur in server error" });
  // }
}

const getMyPost = async (req, res) => {
  var current = await currentUser();
  if (!current) {
    return res.status(400).json({ succes: false, message: "No found user " });
  }

  var page = req.query.page;
  var status = req.query.status;
  var category_id = req.query.category_id;
  var id = current.id;

  getResultPost(id, status, category_id, null, null, null, page, res);
};

const getPost = async (req, res) => {
  var user_id = req.params.id;
  var page = req.query.page;
  var category_id = req.query.category_id;
  var province = req.query.province;
  var search = req.query.search;
  var status = req.query.status;
  var create_at = req.query.create_at;

  getResultPost(
    user_id,
    status,
    category_id,
    province,
    search,
    create_at,
    page,
    res
  );
};

function createTitleArray(title) {
  var array = [];
  //cut continiously
  for (let i = 1; i < title.length + 1; i++) {
    array.push(title.substring(0, i));
  }
  // 2 char
  for (let i = 0; i < title.length - 1; i++) {
    array.push(title[i] + "" + title[i + 1]);
    if (i < title.length - 2) {
      array.push(title[i] + "" + title[i + 1] + "" + title[i + 2]);
    }
  }

  newArray = array
    .concat(title.match(/.{1,3}/g))
    .concat(title.match(/.{1,4}/g))
    .concat(title.split(" "))
    .concat(title.split("+"))
    .concat(title.split("-"))
    .concat(title.split("("))
    .concat(title.split(")"))
    .concat(title.split(""))
    .filter(function (item, index, self) {
      return item !== " " && index === self.indexOf(item);
    });
  return newArray;
}

async function queryPost(
  user_id,
  status,
  category_id,
  province,
  search,
  create_at,
  limit,
  start
) {
  var data = db.collection("post");
  if (user_id) {
    data = data.where("user_id", "==", user_id);
  }
  if (status) {
    data = data.where("status", "==", status);
  }
  if (category_id) {
    data = data.where("category_id", "==", category_id);
  }
  if (province) {
    data = data.where("province", "==", province);
  }
  if (search) {
    data = data.where("arrayTitle", "array-contains", search.toLowerCase());
  }
  if (create_at == "ASC") {
    data = data.orderBy("create_at");
  } else {
    data = data.orderBy("create_at", "desc");
  }

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
    return res
      .status(400)
      .json({ succes: false, message: "Missing field brand" });
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
      .json({ succes: false, message: "Missing field category" });
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
          create_at: (new Date().getTime() / 1000),
          update_at: (new Date().getTime() / 1000),
          status: "pending",
          brand_id: req.body.brand_id,
          price: (req.body.price),
          address: req.body.address,
          description: req.body.description,
          arrayTitle: createTitleArray(req.body.title.toLowerCase()),
          province: req.body.address.split(",")[2],
        };
        // add db
        // try {
          const postDb = db.collection("post");
          const response = await postDb.doc().set(newPost);
          console.log(newPost);
          if (response) {
            return res
              .status(200)
              .json({ success: true, message: "Add post successfully" });
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Add post failed" });
          }
        // } catch (e) {
        //   return res
        //     .status(500)
        //     .json({ success: false, message: "Occur in server error" });
        // }
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
      updatePost.arrayTitle = createTitleArray(req.body.title.toLowerCase());
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

    updatePost.update_at = (new Date().getTime() / 1000);

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
  getMyPost,
  getPost,
  createPost,
  updatePost,
  deletePost,
  updateStatusPost,
};

const { db } = require("../config/fbConfig");
const AdminBro = require("admin-bro");

module.exports = {
  collection: db.collection("category"),
  schema: {
    name: "string",
    sub_thumbnail: "string",
    thumbnail: "string",
  },
  options: {
    listProperties: ["id", "thumbnail", "name", "sub_thumbnail"],
    properties: {
      sub_thumbnail: {
        components: {
          list: AdminBro.bundle("../views/sub_thumbnail"),
          show: AdminBro.bundle("../views/sub_thumbnail_with_title"),
        },
      },
      thumbnail: {
        components: {
          list: AdminBro.bundle("../views/thumbnail"),
          show: AdminBro.bundle("../views/thumbnail_with_title"),
        },
      },
    },
  },
};

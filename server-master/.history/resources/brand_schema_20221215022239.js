const { db } = require("../config/fbConfig");
const AdminBro = require("admin-bro");

module.exports = {
  collection: db.collection("brand"),
  schema: {
    name: "string",
    image: "string",
  },
  options: {
    listProperties: ["id", "image", "name"],
    properties: {
      image: {
        components: {
          list: AdminBro.bundle("../views/brand_picture"),
          show: AdminBro.bundle("../views/brand_picture_with_title"),
        },
      },
    },
  },
};

const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("category"),
  schema: {
    name: "string",
    sub_thumbnail: "string",
    thumbnail: "string",
  },
  options: {
    listProperties: ["id", "thumbnail", "name","sub_thumbnail"],
  },
};

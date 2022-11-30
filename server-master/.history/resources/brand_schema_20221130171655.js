const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("brand"),
  schema: {
    content: "image",
    image: "name"
  },
  options: {
    listProperties: [
      "id",
      "title",
      "content",
      "image",
      "url",
    ],
  }
}
const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("ads"),
  schema: {
    content: "string",
    image: "string",
    title: "string",
    url: "string",
  },
  options: {
    listProperties: ["id", "content", "title", "image", "url"],
  },
};

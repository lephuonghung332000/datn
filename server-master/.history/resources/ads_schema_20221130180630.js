const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("ads"),
  schema: {
    content: "string",
    title: "string",
    image: "string",
    url: "string",
  },
  options: {
    listProperties: ["id", "title", "content", "image", "url",],
  },
};

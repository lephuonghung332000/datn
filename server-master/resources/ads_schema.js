const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection('advertising'),
  schema: {
    content: "string",
    image: "string",
    title: "string",
    url: "string",
  },
  options: {
    listProperties: ["id", "title", "content", "image", "url"],
  },
};

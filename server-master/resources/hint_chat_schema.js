const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("hint_chat"),
  schema: {
    content: "string",
  },
  options: {
    listProperties: ["id", "content"],
  },
};

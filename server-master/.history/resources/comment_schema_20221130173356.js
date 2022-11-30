const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("comment"),
  schema: {
    content: "string",
    create_at: "number",
    post_id: "string",
    update_at: "number",
    user_id: "string",
  },
  options: {
    listProperties: ["id", "post_id", "content", "user_id", "create_at"],
  },
};

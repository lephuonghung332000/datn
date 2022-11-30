const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("search_history"),
  schema: {
    key: "string",
    content: "string",
    create_at: "number",
  },
  options: {
    listProperties: ["id","key", "content", "create_at"],
  },
};

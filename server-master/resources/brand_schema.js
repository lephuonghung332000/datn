const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("brand"),
  schema: {
    name: "string",
    image: "string",
  },
  options: {
    listProperties: ["id", "image", "name"],
  },
};

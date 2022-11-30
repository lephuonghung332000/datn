const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("ads"),
  schema: {
    name: "string",
    image: "string",
  },
  options: {
    listProperties: ["id", "image", "name"],
  },
};

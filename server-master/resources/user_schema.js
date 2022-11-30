const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("user"),
  schema: {
    address: "string",
    avatar: "string",
    birthday: "number",
    create_at: "number",
    email: "string",
    fcmTokens: "array",
    fullname: "string",
    gender: "boolean",
    name: "string",
    phone: "string",
    role: "string",
  },
  options: {
    listProperties: [
      "id",
      "avatar",
      "fullname",
      "email",
      "role",
      "address",
      "gender",
      "birthday",
    ],
  },
};

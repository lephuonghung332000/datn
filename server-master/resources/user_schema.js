const { db } = require("../config/fbConfig");
const AdminBro = require("admin-bro");

module.exports = {
  collection: db.collection("user"),
  schema: {
    address: "string",
    avatar: "string",
    birthday: "number",
    create_at: "number",
    email: "string",
    fullname: "string",
    gender: "boolean",
    name: "string",
    phone: "string",
    role: "string",
  },
  options: {
    listProperties: [
      "id",
      "fullname",
      "email",
      "role",
      "address",
      "gender",
      "avatar",
      "birthday",
    ],
    properties: {
      avatar: {
        components: {
          list: AdminBro.bundle("../views/user_picture"),
          show: AdminBro.bundle("../views/user_picture_with_title"),
        },
      },
      gender: {
        components: {
          list: AdminBro.bundle("../views/gender"),
          show: AdminBro.bundle("../views/gender_with_title"),
        },
      },
      birthday: {
        components: {
          list: AdminBro.bundle("../views/birthday_convert"),
          show: AdminBro.bundle("../views/birthday_convert_with_title"),
        },
      },
      create_at: {
        isVisible: { show: false, list: false, edit: false },
      },
      id: {
        isVisible: { show: false, list: true, edit: false },
      },
    },
  },
};

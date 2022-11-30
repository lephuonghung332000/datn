const { db } = require("../config/fbConfig");

module.exports = {
  collection: db.collection("post"),
  schema: {
    address: "string",
    arrayTitle: "array",
    category_id: "string",
    brand_id: "string",
    create_at: "number",
    description: "string",
    images: "array",
    price: "number",
    province: "string",
    status: "string",
    title: "string",
    update_at: "number",
    user_id: "string",
  },
  options: {
    listProperties: [
      "id",
      "title",
      "description",
      "category_id",
      "price",
      "status",
      "user_id",
      "images",
      "create_at"
    ],
  },
};
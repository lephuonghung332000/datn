const { db } = require("../config/fbConfig");
const AdminBro = require("admin-bro");
const axios = require("axios");

module.exports = {
  collection: db.collection("adss"),
  schema: {
    content: "string",
    image: "string",
    title: "string",
    url: "string",
  },
  options: {
    listProperties: ["id", "title", "content", "image", "url"],
    properties: {
      image: {
        name: "image",
        components: {
          list: AdminBro.bundle("../views/ads_picture"),
          show: AdminBro.bundle("../views/ads_picture"),
        },
      },
    },
    actions: {
      new: {
        actionType: "resource",
        isVisible: true,
        component: AdminBro.bundle("../views/create_ads"),
        handler: (request, response, context) => {
          const { record } = context;
          try {
            return {
              record: record.toJSON(),
            };
          } catch (error) {
            return {
              record: record.toJSON(),
            };
          }
        },
      },
      edit: {
        components: false,
        isVisible: false,
      },
    },
  },
};

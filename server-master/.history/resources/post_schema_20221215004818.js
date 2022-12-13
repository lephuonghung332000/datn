const { db } = require("../config/fbConfig");
const axios = require("axios");

const AdminBro = require("admin-bro");
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
    properties: {
      user: {
        components: {
          list: AdminBro.bundle("../views/user_name"),
          show: AdminBro.bundle("../views/user_name_with_title"),
          edit: AdminBro.bundle("../views/user_name_with_title"),
        },
      },
      create_at: {
        components: {
          list: AdminBro.bundle("../views/date_time_convert"),
          show: AdminBro.bundle("../views/date_time_convert_with_title"),
          edit: AdminBro.bundle("../views/date_time_convert_with_title"),
        },
      },
      category: {
        components: {
          list: AdminBro.bundle("../views/category_name"),
          show: AdminBro.bundle("../views/category_name_with_title"),
          edit: AdminBro.bundle("../views/category_name_with_title"),
        },
      },
      image: {
        components: {
          list: AdminBro.bundle("../views/picture_url"),
          show: AdminBro.bundle("../views/list_picture_url_with_title"),
          edit: AdminBro.bundle("../views/list_picture_url_with_title"),
        },
      },
      arrayTitle: {
        isVisible: false,
      },
      images: {
        isVisible: { show: false, list: false, edit: false },
      },
      category_id: {
        isVisible: { show: false, list: false, edit: false },
      },
      user_id: {
        isVisible: { show: false, list: false, edit: false },
      },
      brand_id: {
        isVisible: { show: false, list: false, edit: false },
      },
    },
    listProperties: [
      "id",
      "title",
      "description",
      "price",
      "status",
      "user",
      "category",
      "create_at",
      "image",
    ],
    editProperties: [
      "id",
      "title",
      "description",
      "price",
      "status",
      "user",
      "category",
      "create_at",
      "image",
    ],
    showProperties: [
      "id",
      "title",
      "description",
      "price",
      "status",
      "user",
      "category",
      "create_at",
      "image",
    ],
    actions: {
      pending: {
        actionType: "record",
        component: false,
        isVisible: (context) => context.record.param("status") !== "pending",
        handler: async (request, response, context) => {
          const { record } = context;
          // try {
            var post_id = record.params.id;
            var result = await updateStatusPost(post_id, "pending");
            return {
              notice: {
                message: `Bài đăng ${record.params.title} đã đưa về trạng thái chờ phê duyệt`,
                type: "success",
              },
              record: record.toJSON(),
              redirectUrl: "/admin/resources/post",
            };
          // } catch (error) {
          //   return {
          //     notice: {
          //       message: "Lỗi cập nhật bài đăng",
          //       type: "error",
          //     },
          //     record: record.toJSON(result),
          //   };
          // }
        },
        parent: "Edit status",
      },
      accept: {
        actionType: "record",
        isVisible: (context) => context.record.param("status") !== "accept",
        component: false,
        handler: async (request, response, context) => {
          const { record } = context;
          // try {
            var post_id = record.params.id;
            var result = await updateStatusPost(post_id, "accept");
            return {
              notice: {
                message: `Bài đăng ${record.params.title} đã được duyệt`,
                type: "success",
              },
              record: record.toJSON(),
              redirectUrl: "/admin/resources/post",
            };
          // } catch (error) {
          //   return {
          //     notice: {
          //       message: "Lỗi cập nhật bài đăng",
          //       type: "error",
          //     },
          //     record: record.toJSON(result),
          //   };
          // }
        },
        parent: "Edit status",
      },
      reject: {
        actionType: "record",
        isVisible: (context) => context.record.param("status") !== "reject",
        component: false,
        handler: async (request, response, context) => {
          const { record } = context;
          // try {
            var post_id = record.params.id;
            var result = await updateStatusPost(post_id, "reject");
            return {
              notice: {
                message: `Bài đăng ${record.params.title} đã bị từ chối`,
                type: "success",
              },
              record: record.toJSON(),
              redirectUrl: "/admin/resources/post",
            };
          // } catch (error) {
          //   return {
          //     notice: {
          //       message: "Lỗi cập nhật bài đăng",
          //       type: "error",
          //     },
          //     record: record.toJSON(result),
          //   };
          // }
        },
        parent: "Edit status",
      },
    },
  },
};

async function updateStatusPost(post_id, status) {
  const options = {
    method: "PATCH",
    url: `http://localhost:5000/api/post/updatePost/status/${post_id}`,
    data: {
      status: status,
    },
  };
  const result = await axios(options);
  return result;
}

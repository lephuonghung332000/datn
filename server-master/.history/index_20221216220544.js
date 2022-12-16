const express = require("express");
const { firebase } = require("./config/fbConfig");

const isAdmin = require("./utils/CheckRole");
//for admin setup
const AdminBroExpress = require("@admin-bro/express");
const AdminBroFirebase = require("@tirrilee/admin-bro-firebase");
const AdminBro = require("admin-bro");
const UserSchema = require("./resources/user_schema");
const AdsSchema = require("./resources/ads_schema");
const BrandSchema = require("./resources/brand_schema");
const CategorySchema = require("./resources/category_schema");
const PostSchema = require("./resources/post_schema");

require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();
//socket
socketListner(PORT);
//for admin panel
AdminBro.registerAdapter(AdminBroFirebase.FirestoreAdapter);
const adminBro = new AdminBro({
  rootPath: "/admin",
  resources: [UserSchema, BrandSchema, CategorySchema, PostSchema, AdsSchema],
});

const authorRouter = require("./routers/authorRouter");
const userRouter = require("./routers/userRouter");
const adsRouter = require("./routers/adsRouter");
const chatRouter = require("./routers/chatRouter");
const searchRouter = require("./routers/searchRouter");
const categoryRouter = require("./routers/categoryRouter");
const postRouter = require("./routers/postRouter");
const brandRouter = require("./routers/brandRouter");
const commentRouter = require("./routers/commentRouter");
const countryRouter = require("./routers/countryRouter");
const notificationRouter = require("./routers/notificationRouter");

const secret = "very_secret_secret";
const loginAdminRouter = AdminBroExpress.buildAuthenticatedRouter(
  adminBro,
  {
    authenticate: async (email, password) => {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const checkAdmin = await isAdmin();
      if (checkAdmin) {
        return user;
      }
      return false;
    },
    cookiePassword: "some-secret-password-used-to-secure-cookie",
    cookieName: "adminbro",
  },
  null,
  {
    resave: true,
    saveUninitialized: true,
    secret,
  }
);
app.use(adminBro.options.rootPath, loginAdminRouter);

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json("Hello");
});

app.use("/api/auth", authorRouter.routes);
app.use("/api/user", userRouter.routes);
app.use("/api/ads", adsRouter.routes);
app.use("/api/chat", chatRouter.routes);
app.use("/api/search", searchRouter.routes);
app.use("/api/category", categoryRouter.routes);
app.use("/api/post", postRouter.routes);
app.use("/api/brand", brandRouter.routes);
app.use("/api/comment", commentRouter.routes);
app.use("/api/province", countryRouter.routes);
app.use("/api/notification", notificationRouter.routes);

// app.listen(PORT, () => {
//   console.log("app is listen at " + PORT);
// });

function socketListner(port) {
  const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  io.on("connection", function (client) {
    console.log("client connect...", client.id);

    client.on("message", function (data) {
      console.log(data);
      io.emit("message", data);
    });

    client.on("connect", function () {});

    client.on("disconnect", function () {
      console.log("client disconnect...", client.id);
      // handleDisconnect()
    });

    client.on("error", function (err) {
      console.log("received error from client:", client.id);
      console.log(err);
    });
  });

  // server.listen(port, function (err) {
  //   if (err) throw err;
  //   console.log("Listening on port %d", port);
  // });

  app.get("/socketChat", (req, res) => {
    res.send("server successed starting.");
  });
}

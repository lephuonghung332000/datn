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

require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();
//for admin panel
AdminBro.registerAdapter(AdminBroFirebase.FirestoreAdapter);
const adminBro = new AdminBro({
  rootPath: "/admin",
  resources: [UserSchema, AdsSchema,BrandSchema,CategorySchema],
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
const loginAdminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const checkAdmin = await isAdmin();
    if (checkAdmin) {
      return user;
    }
    return null;
  },
  cookiePassword: "some-secret-password-used-to-secure-cookie",
  cookieName: 'adminbro',
});

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
app.use(adminBro.options.rootPath, loginAdminRouter);

app.listen(PORT, () => {
  console.log("app is listen at " + PORT);
});

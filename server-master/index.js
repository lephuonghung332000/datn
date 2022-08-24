const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();


const authRouter = require("./routers/author");
const postRouter = require("./routers/post");
const profileRouter = require("./routers/profile");
const productRouter = require("./routers/product");
const commentRouter = require("./routers/comment");
const chatRouter = require("./routers/chat");
const notificationRouter = require("./routers/notification");
const searchRouter = require("./routers/search");
const adsRouter = require("./routers/ads");
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGOOSE_URL.replace("db_user", process.env.DB_USERNAME).replace("db_password", process.env.DB_PASSWORD),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );
    console.log("connect");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", profileRouter);
app.use("/api/product", productRouter);
app.use("/api/comment", commentRouter);
app.use("/api/chat", chatRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/search", searchRouter);
app.use("/api/ads", adsRouter);
app.get("/", (req, res) => {
  res.json();
});



app.listen(PORT, () => {
  console.log("app is listen at " + PORT);
});

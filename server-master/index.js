const express = require("express");

require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

const authorRouter = require('./routers/authorRouter');
const userRouter = require('./routers/userRouter');
const adsRouter = require('./routers/adsRouter');
const chatRouter = require('./routers/chatRouter');
const searchRouter = require('./routers/searchRouter');
const categoryRouter = require('./routers/categoryRouter');
const postRouter = require('./routers/postRouter');
const branchRouter = require('./routers/branchRouter');
const commentRouter = require('./routers/commentRouter');

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json("Hello");
});

app.use('/api/auth',authorRouter.routes);
app.use('/api/user',userRouter.routes);
app.use('/api/ads',adsRouter.routes);
app.use('/api/chat',chatRouter.routes);
app.use('/api/search',searchRouter.routes);
app.use('/api/category',categoryRouter.routes);
app.use('/api/post',postRouter.routes);
app.use('/api/branch',branchRouter.routes);
app.use('/api/comment',commentRouter.routes);

app.listen(PORT, () => {
  console.log("app is listen at " + PORT);
});

//import
const express = require("express");
const app = express();
const cors = require("cors");
const conversationRoute = require("./routes/chatRoute/conversation-route");
const messageRoute = require("./routes/chatRoute/message-route");
const userRoute = require("./routes/chatRoute/user-route");
const notFound = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error-middleware");
const authRoute = require("./routes/auth-route/auth-route");
const authenticate = require("./middlewares/authenticate");
const { Server } = require("socket.io");

//middlewares
app.use(cors());
app.use(express.json());

//service

//auth
app.use("/auth", authRoute);

// service chatapp
app.use("/conversation", authenticate, conversationRoute);
app.use("/message", authenticate, messageRoute);
app.use("/user", authenticate, userRoute);

// not found
app.use(notFound);

// error
app.use(errorMiddleware);

const port = process.env.PORT || 8080;
let server;
server = app.listen(port, () => console.log("Server on", port));

//socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("socket io connected successfully.");
});

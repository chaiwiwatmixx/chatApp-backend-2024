const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../../controllers/chat-controller/message-controllers");
const Route = express.Router();

Route.post("/", sendMessage);
Route.get("/:convo_id", getMessages);

module.exports = Route;

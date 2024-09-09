const express = require("express");
const { create_open_conversation, getConversations } = require("../../controllers/chat-controller/conversation-controllers");
const Route = express.Router();

Route.post("/", create_open_conversation);
Route.get("/", getConversations);

module.exports = Route;

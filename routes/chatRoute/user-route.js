const express = require("express");
const {
  searchUsers,
} = require("../../controllers/chat-controller/user-controllers");
const Route = express.Router();

Route.get("/", searchUsers);

module.exports = Route;

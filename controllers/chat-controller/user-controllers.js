const customError = require("../../utils/customError");
const tryCatch = require("../../utils/tryCatch");
const prisma = require("../../models");
const {
  searchUsers: searchUsersService,
} = require("../../services/chatApp/user.service");

const searchUsers = async (req, res, next) => {
  userId = req.user.user_id;
  try {
    const keyword = req.query.search;
    if (!keyword) {
      throw customError("Please add a search query first", 400);
    }
    const users = await searchUsersService(keyword, userId);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const testUsers = async (req, res, next) => {
  res.status(200).json("testUsers");
};

module.exports = {
  searchUsers,
  testUsers,
};

const jwt = require("jsonwebtoken");
const prisma = require("../models");
const customError = require("../utils/customError");
const tryCatch = require("../utils/tryCatch");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // get token
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw customError("Unauthorized", 401);
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      throw customError("Unauthorized", 401);
    }

    // verify
    const { user_id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { user_id: user_id } });

    if (!user) {
      throw customError("User not found", 401);
    }

    req.user = user.id;
    next();
  } catch (error) {
    next(error);
  }
};

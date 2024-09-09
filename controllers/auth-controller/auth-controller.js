const bcrypt = require("bcryptjs");
const customError = require("../../utils/customError");
const tryCatch = require("../../utils/tryCatch");
const prisma = require("../../models");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    const { username, password, password2, email } = req.body;

    if (!username || !password || !password2 || !email) {
      throw customError("Please fill all inputs", 400);
    }

    // Check password
    if (password != password2) {
      res.status(400);
      throw customError("Password do not match", 400);
    }

    // check already email
    const checkEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (checkEmail) {
      res.status(400);
      throw customError("already have this email", 400);
    }

    // hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const createUser = await prisma.user.create({
      data: { username, password: hashedPassword, email },
    });

    res.status(200).json(createUser);
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw customError("Please fill all inputs.", 400);
    }

    // check already email
    const checkEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!checkEmail) {
      res.status(400);
      throw customError("Email not found.", 400);
    }

    const checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (checkPassword) {
      //jwt sign
      const token = await jwt.sign(
        { user_id: checkEmail.user_id },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
          algorithm: "HS256",
        }
      );
      res.json(token);
    } else {
      throw customError("Password is incorrect.", 401);
    }
  } catch (error) {
    next(error);
  }
};

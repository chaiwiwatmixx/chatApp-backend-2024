const customError = require("../../utils/customError");
const tryCatch = require("../../utils/tryCatch");
const prisma = require("../../models");

const findUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { user_id: parseInt(userId) },
  });

  if (!user) {
    throw customError("User not found.", 400);
  }
  return user;
};

const searchUsers = async (keyword, userId) => {
  try {
    const keywordLowercase = keyword.toLowerCase();
    const users = await prisma.$queryRaw`
      SELECT user_id, username, email, picture, status
      FROM User
      WHERE (
        LOWER(username) LIKE ${"%" + keywordLowercase + "%"}
        OR LOWER(email) LIKE ${"%" + keywordLowercase + "%"}
      )
      AND user_id != ${userId}
    `;
    return users;
  } catch (error) {
    console.error("Error searching users: ", error);
    throw customError("Failed to search users!", 400);
  }
};

module.exports = {
  findUser,
  searchUsers,
};

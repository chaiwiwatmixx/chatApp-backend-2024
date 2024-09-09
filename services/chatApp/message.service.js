const customError = require("../../utils/customError");
const tryCatch = require("../../utils/tryCatch");
const prisma = require("../../models");

const createMessage = async (data) => {
  try {
    const newMessage = await prisma.message.create({
      data,
    });
    return newMessage;
  } catch (error) {
    console.error("Error creating message: ", error);
    throw customError("Failed to create message!", 400);
  }
};

const populateMessage = async (id) => {
  try {
    const msg = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            username: true,
            picture: true,
          },
        },
        conversation: {
          include: {
            users: {
              include: {
                user: {
                  select: {
                    username: true,
                    email: true,
                    picture: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!msg) throw createHttpError.BadRequest("Oops...Something went wrong!");
    return msg;
  } catch (error) {
    console.error("Error populating message: ", error);
    throw createHttpError.BadRequest("Failed to populate message!");
  }
};

const getConvoMessages = async (convo_id) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: parseInt(convo_id) },
      include: {
        sender: {
          select: {
            username: true,
            picture: true,
            email: true,
            status: true,
          },
        },
        conversation: true,
      },
    });
    if (!messages || messages.length === 0) {
      throw customError("User not found in getConvoMessages.", 400);
    }
    return messages;
  } catch (error) {
    console.error("Error getting conversation messages: ", error);
    throw customError("Failed to get messages!", 400);
  }
};

module.exports = {
  createMessage,
  populateMessage,
  getConvoMessages
};

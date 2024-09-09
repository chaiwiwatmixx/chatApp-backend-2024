const customError = require("../../utils/customError");
const tryCatch = require("../../utils/tryCatch");
const prisma = require("../../models");

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

const doesConversationExist = async (sender_id, receiver_id) => {
  const convos = await prisma.conversation.findMany({
    where: {
      isGroup: false,
      AND: [
        {
          users: {
            some: {
              userId: parseInt(sender_id),
            },
          },
        },
        {
          users: {
            some: {
              userId: parseInt(receiver_id),
            },
          },
        },
      ],
    },
    include: {
      users: {
        include: {
          user: {
            select: {
              user_id: true,
              username: true,
              picture: true,
            },
          },
        },
      },
      latestMessage: {
        include: {
          sender: {
            select: {
              user_id: true,
              username: true,
              email: true,
              picture: true,
              status: true,
            },
          },
        },
      },
    },
  });

  // console.log(convos);

  // if (!convos.length) {
  //   throw customError("Something went wrong in doesConversationExist", 400);
  // }

  return convos[0];
};

const createConversation = async (data) => {
  const { senderId, receiverId, username, picture, isGroup } = data;

  // check senderId and receiverId data
  if (!senderId || !receiverId) {
    throw customError("senderId or receiverId is missing", 400);
  }

  try {
    const newConvo = await prisma.$transaction(async (prisma) => {
      const conversation = await prisma.conversation.create({
        data: {
          username,
          picture,
          isGroup,
          users: {
            create: [
              { user: { connect: { user_id: senderId } } },
              { user: { connect: { user_id: receiverId } } },
            ],
          },
        },
        include: {
          users: true,
          latestMessage: true,
        },
      });

      return conversation;
    });

    if (!newConvo) {
      throw customError("Something went wrong in createConversation", 400);
    }

    return newConvo;
  } catch (error) {
    console.log("Error creating conversation:", error);
    throw error;
  }
};

const populateConversation = async (id, include) => {
  const populatedConvo = await prisma.conversation.findUnique({
    where: { id },
    include,
  });
  if (!populatedConvo) {
    throw customError("Oops...Something went wrong populateConversation", 400);
  }
  return populatedConvo;
};

const getUserConversations = async (user_id) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            userId: parseInt(user_id),
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                picture: true,
                email: true,
                status: true,
              },
            },
          },
        },
        admin: {
          select: {
            user_id: true,
            username: true,
            picture: true,
            email: true,
            status: true,
          },
        }, //remove
        latestMessage: {
          include: {
            sender: {
              select: {
                user_id: true,
                username: true,
                email: true,
                picture: true,
                status: true,
              }, //edit more
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!conversations) {
      throw customError(
        "Oops...Something went wrong process getUserConversations",
        400
      );
    }

    return conversations;
  } catch (error) {
    console.error("Error getting user conversations: ", error);
    throw customError("Oops...Something went wrong getUserConversations", 400);
  }
};

const updateLatestMessage = async (convo_id, msg_id) => {
  console.log("convo_id = ", convo_id);
  console.log("msg_id = ", msg_id);
  try {
    const updatedConvo = await prisma.conversation.update({
      where: { id: parseInt(convo_id) },
      data: { latestMessageId: parseInt(msg_id) },
    });
    if (!updatedConvo) {
      throw customError(
        "Oops...Something went wrong in updateLatestMessage! ",
        400
      );
    }

    return updatedConvo;
  } catch (error) {
    console.error("Error updating latest message: ", error);
    throw customError("Failed to update latest message!", 400);
  }
};

module.exports = {
  doesConversationExist,
  createConversation,
  populateConversation,
  getUserConversations,
  updateLatestMessage,
};

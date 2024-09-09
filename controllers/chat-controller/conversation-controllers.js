const customError = require("../../utils/customError");
const tryCatch = require("../../utils/tryCatch");
const prisma = require("../../models");
const {
  doesConversationExist,
  createConversation,
  populateConversation,
  getUserConversations,
} = require("../../services/chatApp/conversation.service");
const { findUser } = require("../../services/chatApp/user.service");

const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.user_id; //ปิดรอ auth
    const { receiver_id } = req.body;

    //check if receiver_id is provided
    if (!receiver_id) {
      throw customError(
        "please provide the user id you wanna start a conversation with !",
        400
      );
    }

    //check if chat exists
    const existed_conversation = await doesConversationExist(
      sender_id,
      receiver_id
    );
    // if chat exists do ....
    if (existed_conversation) {
      res.json(existed_conversation);
      // not chat exists do ....
    } else {
      // check receiver_id sender_id have data
      let receiver_user = await findUser(parseInt(receiver_id));
      let sender_user = await findUser(parseInt(sender_id));
      if (!receiver_user || !sender_user) {
        console.log("User not found");
        throw customError("User not found", 404);
      }

      // Prepare information
      let convoData = {
        senderId: parseInt(sender_id),
        receiverId: parseInt(receiver_id),
        username: receiver_user.username,
        picture: receiver_user.picture,
        isGroup: false,
      };
      // createConversation
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(newConvo.id, {
        users: true,
        latestMessage: { include: { sender: true } },
      });
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.user_id; //ปิดรอ auth
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

module.exports = { create_open_conversation, getConversations };

const customError = require("../../utils/customError");
const tryCatch = require("../../utils/tryCatch");
const prisma = require("../../models");
const {
  createMessage,
  populateMessage,
  getConvoMessages,
} = require("../../services/chatApp/message.service");
const {
  updateLatestMessage,
} = require("../../services/chatApp/conversation.service");

const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { message, convo_id, files } = req.body;
    if (!convo_id || (!message && !files)) {
      throw customError(
        "Please provide a conversation id and a message body !",
        400
      );
    }
    const msgData = {
      senderId: parseInt(user_id),
      message,
      conversationId: parseInt(convo_id),
      files: files || [],
    };
    let newMessage = await createMessage(msgData);
    let populatedMessage = await populateMessage(newMessage.id);
    await updateLatestMessage(convo_id, newMessage.id);
    res.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const convo_id = req.params.convo_id;
    if (!convo_id) {
      throw customError("Please add a conversation id in params.", 400);
    }
    const messages = await getConvoMessages(convo_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
};

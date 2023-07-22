import Message from "../models/message.js";
import User from "../models/user.js";

export const postMessage = async (req, res) => {
  const { _id } = req.user;
  const { conversationId, content } = req.body;

  try {
    const newMessage = new Message({
      conversationId,
      senderId: _id,
      content,
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessage = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).populate({
      path: "senderId",
      select: "_id username profilePic",
      model: User,
    });
    res.status(200).json({messages:messages});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

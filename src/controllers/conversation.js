import Conversation from "../models/conversation.js";
import User from "../models/user.js";



export const initiateConversation = async (req, res) => {
  const { _id } = req.user;
  const { receiverId } = req.body;
  try {
    const newConversation = new Conversation({
      participants: [_id, receiverId],
    });
    const saved = await newConversation.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getConversation = async (req, res) => {
  const { _id } = req.user; // Assuming you have the user's ID in req.user
  try {
    const conversations = await Conversation.find({
      participants: { $in: [_id] },
    })
      .populate({
        path: "participants",
        select: "username _id profilePic",
        model: User,
      })
      .exec();

    res.status(200).json({conversations:conversations});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



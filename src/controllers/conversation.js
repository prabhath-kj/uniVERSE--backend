import Conversation from "../models/conversation.js";
import User from "../models/user.js";

export const initiateConversation = async (req, res) => {
  const { _id } = req.user;
  const { receiverId } = req.body;
  try {
    const newConversation = new Conversation({
      participants: [_id, receiverId],
    });
    await newConversation.save()
    const newRoom =await Conversation.findOne({participants:{$all:[_id,receiverId]}}).populate({
      path: "participants",
      select: "username _id profilePic",
      model: User,
    })
    .exec()
   console.log(newRoom);
    res.status(200).json({ room: newRoom });
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

    res.status(200).json({ conversations: conversations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMembers = async (req, res) => {
  try {
    const { _id } = req.user;
    const conversation = await Conversation.findById(req.params.id);
    const { participants } = conversation;
    res.status(200).json({ members: participants });
  } catch (error) {}
};

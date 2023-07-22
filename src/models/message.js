import { Schema, model } from "mongoose";
const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Message = model("Message", messageSchema);

export default Message;

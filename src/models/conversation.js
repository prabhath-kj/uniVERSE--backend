import { Schema, model } from "mongoose";
const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Conversation = model("Conversation", conversationSchema);

export default Conversation;

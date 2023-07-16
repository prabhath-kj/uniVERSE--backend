import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  sender: { type:Schema.Types.ObjectId, ref: "User" },
  receiver: { type:Schema.Types.ObjectId, ref: "User" },
  type: String,
  timestamp: { type: Date, default: Date.now },
});
const Notification = model("Notification", NotificationSchema);


const createNotification = async (senderId, receiverId, type) => {
    const notification = new Notification({
      sender: senderId,
      receiver: receiverId,
      type: type,
    });
    await notification.save();
  };
export {Notification,createNotification} 
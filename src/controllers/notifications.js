import { Notification } from "../models/notification.js";

export const getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ receiver: req?.user?._id }).populate("sender");
      const messages = notifications.map(notification => {
        return `Hi ${notification.sender?.username} ${notification.type} you.`;
      });
  
      return res.status(200).json({ data: messages });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  export const clearNotifications=async(req,res)=>{
    const {_id}=req.user
    try {
      await Notification.deleteMany({receiver:_id})
      return res.status(200).json({ message:"Successfully updated" });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });

    }
  }
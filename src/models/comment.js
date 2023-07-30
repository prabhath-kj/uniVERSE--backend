import mongoose from "mongoose";
import  Populate  from "../utils/autoPopulate.js";
import Activity from "./activityFeeds.js";

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: function () {
      return !this.parent;
    },
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});


commentSchema
    .pre('findOne', Populate('userId'))
    .pre('findOne', Populate('replies'))
    .pre('find', Populate('userId'))
    .pre('find', Populate('replies'))
    .pre('save',async function (next) {
      await Activity.findOneAndUpdate({}, { $inc: { comments: 1 } ,timestamp:Date.now()}, { upsert: true });
      next();
    });
const Comment = model("Comment", commentSchema);
export default Comment;

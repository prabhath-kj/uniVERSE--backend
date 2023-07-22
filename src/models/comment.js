import mongoose from "mongoose";

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




const Comment = model("Comment", commentSchema);
export default Comment;

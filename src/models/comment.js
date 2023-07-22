import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
      replies: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          comment: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    },
  ],
});


const Comment = model("comment", commentSchema);
export default Comment;

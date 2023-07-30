import { Schema, model } from "mongoose";
import Activity from "./activityFeeds.js";

const postSchema = Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    description: String,
    picturePath: Array,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    savedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

postSchema.pre('save', async function (next) {
  await Activity.findOneAndUpdate({}, { $inc: { posts: 1 } ,timestamp:Date.now()}, { upsert: true });
  next();
});
const Post = model("Post", postSchema);

export default Post;

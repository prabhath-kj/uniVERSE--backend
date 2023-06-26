import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  profileView: {
    type: Number,
    default: 0,
  },
  impression: {
    type: Number,
    default: 0,
  },
  online: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  chatUsers: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followers: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  following: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  notifications: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  accountPrivate: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

const User = model("User", userSchema);

export default User;

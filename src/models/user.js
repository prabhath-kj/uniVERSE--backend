import { Schema, model } from "mongoose";
import Jwt from "jsonwebtoken";
import findOrCreate from "mongoose-findorcreate";

const userSchema = new Schema({
  googleId: {
    type: String,
    unique:true,
  },
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
  isAdmin:{
    type:Boolean,
    default:false
  }
});
userSchema.methods.generateToken = function () {
  const token = Jwt.sign({ id: this._id }, process.env.SEC_KEY, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.plugin(findOrCreate);

const User = model("User", userSchema);

export default User;

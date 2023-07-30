import { Schema, model } from "mongoose";
import Jwt from "jsonwebtoken";
import findOrCreate from "mongoose-findorcreate";
import Activity from "./activityFeeds.js";

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
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9AiGanvnjHHJRjWh_QfHUeu-nWsMzzEfPlq8DgoXo5ixd0AYSzNq8Jm9RUnnWqw3WXzs&usqp=CAU",
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: "User",
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
  if(arguments[0].admin){
   
    const token = Jwt.sign({ id: this._id,admin:this.isAdmin}, process.env.SEC_KEY, {
      expiresIn: "1d",
    });
    return token;
  }else{
    
    const token = Jwt.sign({ id: this._id }, process.env.SEC_KEY, {
      expiresIn: "1d",
    });
    return token;
  }
 
};

userSchema.plugin(findOrCreate);
userSchema.pre('save', async function (next) {
  await Activity.findOneAndUpdate({}, { $inc: { users: 1 } ,timestamp:Date.now()}, { upsert: true });
  next();
});
const User = model("User", userSchema);

export default User;

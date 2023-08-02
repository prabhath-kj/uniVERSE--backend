import User from "../models/user.js";
import Token from "../models/token.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../services/mailServices.js";
import cloudinary from "../services/clodinary.js";
import { createNotification } from "../models/notification.js";


export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  try {
    const name=await User.findOne({username:username})
    if(name){
      return res.status(200).send({ message: "Username already exist,please change and register again.." });
    }
    const isOldUser = (await User.findOne({ email: email })) ?? undefined;
    if (isOldUser) {
      return res.status(200).send({ message: "User already exist." });
    }
    if (isOldUser && isOldUser.blocked) {
      return res.status(200).json({ message: "User blocked" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: passwordHash,
      googleId: Math.floor(Math.random() * 10000),
    });

    const response = await newUser.save();

    const newToken = new Token({
      userId: response._id,
      token: token,
    });
    await newToken.save();
    const url = `${process.env.BASE_URL}register/${newUser._id}/verify/${newToken.token}`;
    await sendMail(email, "Verify Email", url);

    res
      .status(201)
      .json({ message: "An Email sent to your account please verify" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ message: "Invalid email or password" });
    if (user?.blocked) return res.json({ message: "you are blocked by admin" });
    if (!user?.password)
      return res.json({ message: "Invalid email or password" });
    const comparePassword =await bcrypt.compare(password, user.password);
    console.log(comparePassword);
    if (!comparePassword)
      return res.json({ message: "Invalid Email or Password" });

    if (!user.isEmailVerified) {
      const token = await Token.findOne({ userId: user._id });
      if (token)
        return res.json({
          message: "you already have a unverified mail,please verify ",
        });
      if (!token) {
        const newToken = new Token({
          userId: response._id,
          token: token,
        });
        await newToken.save();
        const url = `${process.env.BASE_URL}register/${newUser._id}/verify/${newToken.token}`;
        await sendMail(email, "Verify Email", url);

        return res
          .status(201)
          .json({ message: "An Email sent to your account please verify" });
      }
    } else {
      const validate = { admin: "false" };
      const token = user.generateToken(validate);
      return res
        .status(200)
        .json({ user: user, token: token, message: "logged in successfully" });
    }
  } catch (err) {
    console.error(err);
  }
};

export const getUser = async (req, res) => {
  try {
    if (!req?.body?.query) {
      return res
        .status(200)
        .json({ message: "Query parameter 'query' required" });
    }

    const query = req.body.query;

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).exec();

    if (users.length === 0) {
      return res.status(200).json({users:[]});
    }

    res.json({ users: users });
  } catch (err) {
    res.status(200).json({ message: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { _id } = req.user;
    let secureUrl = req.user.profilePic; // Default profilePic value

    if (req.file) {
      const { path } = req.file;
      const { secure_url } = await cloudinary.uploader.upload(path);
      secureUrl = secure_url;
    }

    const { username, email } = req.body;
    const updateUser = {
      username: username,
      email: email,
      profilePic: secureUrl,
    };

    // Retrieve the user instance from the database
    const user = await User.findById(_id);

    // Update the user instance
    user.set(updateUser);
    await user.save();

    // Generate the token using the user's generateToken method
    const token = user.generateToken({ admin: false });

    res.status(200).json({ user: user, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const addFollower = async (req, res) => {
  const { _id } = req.user;
  const { userId } = req.body;
  try {
    const user = await User.findById(_id);
    const userToFollow = await User.findById(userId);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.following.includes(userId)) {
      return res.status(400).json({ message: "Already following this user." });
    }

    user.following.push(userId);
    userToFollow.followers.push(_id);

    const { following } = await user.save();
    const { followers } = await userToFollow.save();

    await createNotification(_id, userId, "followed");

    return res.status(200).json({
      following: following,
      message: "Successfully followed the user.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const removeFollower = async (req, res) => {
  const { _id } = req.user;
  const { userId } = req.body;

  console.log(_id, userId);
  try {
    const user = await User.findById(_id);
    const userToUnFollow = await User.findById(userId);

    if (!user || !userToUnFollow) {
      return res.status(404).json({ message: "User not found." });
    }

    const followingIndex = user.following.indexOf(userId);
    if (followingIndex === -1) {
      return res.status(400).json({ message: "Not following this user." });
    }

    const followerIndex = userToUnFollow.followers.indexOf(_id);
    if (followerIndex === -1) {
      return res.status(400).json({ message: "User is not a follower." });
    }

    user.following.splice(followingIndex, 1);
    userToUnFollow.followers.splice(followerIndex, 1);

    const { following } = await user.save();
    const { followers } = await userToUnFollow.save();
    await createNotification(_id, userId, "unfollowed");

    return res.status(200).json({
      following: following,
      message: "Successfully unfollowed the user.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error." });
    s;
  }
};

export const getProfileUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(200)
      .json({ message: "Query parameter 'query' required" });
  }
  try {
    const user = await User.findOne({ username: id });
    res.status(200).json({ user: user });
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getFollowers = async (req, res) => {
  const { _id } = req.user;

  try {
    const currentUser = await User.findById(_id).populate({
      path: "followers",
      select: "_id username profilePic email",
      model: User,
    });
    const followerUsers = currentUser.followers;

    res.json(followerUsers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving followers" });
  }
};

export const getFollowing = async (req, res) => {
  const { _id } = req.user;
  console.log(req.user);

  try {
    const currentUser = await User.findById(_id).populate({
      path: "following",
      select: "_id username profilePic email",
      model: User,
    });
    const followingUsers = currentUser.following;

    res.json(followingUsers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving following users" });
  }
};

export const recover=async(req,res)=>{
  try{
    const{email}=req.body
    const user =await User.findOne({email:email})
    if(!user){
      return res.status(200).json({error:"You are new to universe,please signup first"})
    }
    if(user?.blocked){
      return res.status(200).json({error:"You are blocked by admin,please contact admin"})
    }
    const generateOTP =  Math.floor(1000 + Math.random() * 9000).toString();
     const newOtp=new Token({
      userId:user?._id,
      token:generateOTP
     })
     await newOtp.save()
    sendMail(email,"OTP",generateOTP)
    res.status(200).json({message:"Otp successfully sended"})
  }catch(err){
    res.status(500).json({ message: "Error retrieving  user" });

  }
}


export const verify = async (req, res) => {
  try {
    const { otp, password, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ error: "No users found" });
    }

    const token = await Token.findOne({ userId: user._id });

    if (token && token.token === otp) {
      await User.findByIdAndUpdate(user._id, { password :password}, { new: true });

      await Token.findByIdAndDelete(token._id);

      return res.status(200).json({ message: "Password reset successful" });
    } else {
      return res.status(200).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const change=async(req,res)=>{
  const {_id}=req.user
  const {  oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(_id);

    // Check if the user exists
    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(200).json({ message: 'Invalid old password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password with the new hashed password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
}
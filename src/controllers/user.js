import User from "../models/user.js";
import Token from "../models/token.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../services/mailServices.js";
import cloudinary from "../services/clodinary.js";
import { log } from "console";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  try {
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
    const comparePassword = bcrypt.compare(password, user.password);
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
      return res.status(200).json({ message: "No users found" });
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
    const token = user.generateToken();

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

    return res.status(200).json({
      followers: followers,
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

    return res.status(200).json({
      followers: followers,
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
    const user = await User.findOne({username:id});
    res.status(200).json({ user: user });
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};

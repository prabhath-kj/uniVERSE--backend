import User from "../models/user.js";
import Token from "../models/token.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../services/mailServices.js";
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

export const verify = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(200).json({ message: "Invalid link" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    console.log(token);
    if (!token) {
      return res.status(200).json({ message: "Invalid link" });
    }

    await User.findByIdAndUpdate(
      user._id,
      { isEmailVerified: true },
      { new: true }
    );

    await Token.findByIdAndRemove(token._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ message: "Invalid email or password" });
    const comparePassword = await bcrypt.compare(password, user.password);
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
      const token=user.generateToken()
      return res
        .status(200)
        .json({ data:token, message: "logged in successfully" });
    }
  } catch (err) {
    console.error(err);
  }
};

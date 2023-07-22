import User from "../models/user.js";
import Token from "../models/token.js";
import { OAuth2Client } from "google-auth-library";
import * as dotenv from "dotenv";
dotenv.config();



export const googleRegister = async (req, res) => {
  const { name, email, picture, sub } = req.body;
  const user = await User.findOne({ email: email });
  if (user)
    return res.json({
      error: `${user?.email} is associated with an existing account.`,
    });
  try {
    await User.findOrCreate(
      { googleId: sub },
      { username: name, email: email, profilePic: picture, googleId: sub }
    );

    res
      .status(200)
      .json({ message: "Resistered Successfull,Please login to continue" });
  } catch (error) {
    console.error("Error in Google registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: req.body.jwt,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const {sub} = ticket.getPayload();

    const user = await User.findOne({ googleId: sub });
    if (user) {
      const validate={admin:"false"}

      const token = user.generateToken(validate);
      return res
        .status(200)
        .json({user:user, token: token, message: "Logged in successfully" });
    } else {
      return res.status(200).json({ message: "Invalid access token" });
    }
  } catch (error) {
    console.error("Error during Google login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

export const checkUserBlocked=async(req,res)=>{
  const {blocked}=req.user
  try {
    res.status(200).json({message:"success"})
  } catch (error) {
    res.status(500).json({error:error})
  }
}
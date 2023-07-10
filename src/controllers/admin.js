import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    var validAdmin = await User.findOne({ email: email });
    if (validAdmin.isAdmin) {
      const token = validAdmin.generateToken();
      return res.status(200).json({
        message: "logged in succesfully",
        admin: validAdmin,
        token: token,
      });
    }
    res.json({
      message: "Invalid Credentials",
    });
  } catch (err) {
    return res.json({ message: "Invalid Credentials" });
  }
};

export const getAllUsers = async (req, res) => {
  console.log("hiiiiiiii");
  try {
    const users = await User.find();
    if (!users) return res.status(200).json({ message: "No users found" });
    res.status(200).json({
      data: users,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

export const editUser = async (req, res) => {
  try {

    const { id, status } = req.body;

    if (!id)
      return res.json({
        message: "User ID required",
      });

    const user = await User.findByIdAndUpdate(
      id,
      {
        blocked: status,
      },
      {
        new: true,
      }
    ).exec();

    res.status(200).json({
      data: user,
      message: `updated`,
    });
  } catch (err) {
    res.status(200).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    if (!req?.params?.id)
      return res.status(400).json({ message: "User ID required" });

    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
      return res
        .status(204)
        .json({ message: `User ID ${req.params.id} not found` });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

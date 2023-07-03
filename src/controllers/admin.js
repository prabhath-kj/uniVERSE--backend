import User from "../models/user.js";
import jwt from "jsonwebtoken";


export const  login= async (req, res) => {
    try {
      const { email } = req.body;
      var validAdmin = await User.findOne({ email: email });
      if (validAdmin.isAdmin) {
         const token= validAdmin.generateToken()
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
      return res.status(400).json({message:"Invalid Credentials"});
    }
  }

export const  getAllUsers=async (req, res) => {
    try {
      const users = await User.find();
      if (!users) return res.status(204).json({ message: "No users found" });
      res.send({
        success: true,
        data: users,
      });
    } catch (err) {
      res.json({
        success: false,
        message: err.message,
      });
    }
  }

 export const deleteUser= async (req, res) => {
    try {
      console.log(req?.params?.id);
      if (!req?.params?.id)
        return res.send({
          sucess: false,
          message: "User ID required",
        });

      const user = await User.findOne({ _id: req.params.id }).exec();
      if (!user) {
        return res.send({
          success: false,
          message: `User ID ${req.params.id} not found`,
        });
      }

      await user.deleteOne({ _id: req.params.id });
      res.send({
        success: true,
        message: `updated`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export const getUser= async (req, res) => {
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
}


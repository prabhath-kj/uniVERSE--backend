import express from "express";
import {
  register,
  login,
  getUser,
  editUser,
  addFollower,
  removeFollower,
  getProfileUser,
  getFollowers,
  getFollowing,
  recover,
  verify,
  change,
} from "../controllers/user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.route("/login").post(login);

router.route("/register").post(register);

router.route("/recoverPassword").post(recover);

router.route("/changePassword").post(authMiddleware,change)

router.route("/verifyOtp").post(verify);

router.route("/searchUser").post(getUser);

router
  .route("/editProfile")
  .post(upload.single("file"), authMiddleware, editUser);

router.route("/follow").post(authMiddleware, addFollower);

router.route("/unFollow").post(authMiddleware, removeFollower);

router.route("/:id").get(authMiddleware, getProfileUser);

router.route("/following/all").get(authMiddleware, getFollowing);

router.route("/followers/all").get(authMiddleware, getFollowers);

export default router;

import express from "express";
import {
  create,
  getTimeLine,
  getUserPosts,
  likePost,
} from "../controllers/post.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(upload.single("file"), authMiddleware, create);
router.route("/timeline").get(authMiddleware, getTimeLine);
router.route("/:userId").get( authMiddleware,getUserPosts);
router.route("/like/:id").get(authMiddleware, likePost);

export default router;

import express from "express";
import {
  create,
  getTimeLine,
  getUserPosts,
  likePost,
  deletePost,
  getReportedPosts,
  getDrafted,
  reportPost,
  savePost,
} from "../controllers/post.js";
import upload from "../middleware/upload.js";
import {
  authMiddleware,
  adminAuthMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", upload.array("images", 4), authMiddleware, create);
router.get("/timeline", authMiddleware, getTimeLine);
router.get("/:userId", authMiddleware, getUserPosts);
router.get("/like/:id", authMiddleware, likePost);
router.post("/save", authMiddleware, savePost);
router.get("/saved/all", authMiddleware, getDrafted);
router.post("/report", authMiddleware, reportPost);
router.get("/report/all", getReportedPosts);
router.post("/delete", deletePost);

export default router;

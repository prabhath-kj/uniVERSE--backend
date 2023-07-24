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
  deleteReport,
} from "../controllers/post.js";
import upload from "../middleware/upload.js";
import {
  authMiddleware,
  adminAuthMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(upload.array("images", 4), authMiddleware, create);

router.route("/timeline").get(authMiddleware, getTimeLine);

router.route("/:userId").get(authMiddleware, getUserPosts);

router.route("/like/:id").get(authMiddleware, likePost);

router.route("/save").post(authMiddleware, savePost);

router.route("/saved/all").get(authMiddleware, getDrafted);

router.route("/report").post(authMiddleware, reportPost);

router.route("/report/all").get(getReportedPosts);

router.route("/report/delete").post(adminAuthMiddleware, deleteReport);

router.route("/delete").post(deletePost);

export default router;

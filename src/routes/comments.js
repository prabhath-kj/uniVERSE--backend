import express from "express";
import {
  getAllComments,
  postComment,
  deleteComment,
  likeComment,
  replyComment,
} from "../controllers/comments.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(authMiddleware, postComment);
router.route("/:postId").get(authMiddleware, getAllComments);
router.route("/like").post(authMiddleware, likeComment);
router.route("/delete").post(authMiddleware, deleteComment);
router.route("/reply").post(authMiddleware, replyComment);

export default router;

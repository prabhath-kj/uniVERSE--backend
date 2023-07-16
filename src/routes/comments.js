import express from "express";
import {getAllComments,postComment,deleteComment} from "../controllers/comments.js"
import {authMiddleware} from "../middleware/authMiddleware.js"
const router = express.Router();


router.route("/").post(authMiddleware,postComment);
router.route("/:postId").get(authMiddleware,getAllComments)
router.route("/delete").post(authMiddleware,deleteComment)

export default router;

import express from "express";
import {
  login,
  getAllUsers,
  editUser,
  getPosts,
} from "../controllers/admin.js";
import { adminAuthMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/login").post(login);

router.route("/users").get(adminAuthMiddleware, getAllUsers);

router.route("/edit-user").post(adminAuthMiddleware, editUser);

router.route("/posts").get(adminAuthMiddleware, getPosts);

export default router;

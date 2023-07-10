import express from "express";
import { login, getAllUsers,editUser } from "../controllers/admin.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/login").post(login);

router.route("/users").get(authMiddleware, getAllUsers);

// router.route("/searchUser", adminController.getUser);

router.route("/edit-user").post(editUser);

export default router;

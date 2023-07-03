import express from "express";
import { login } from "../controllers/admin.js";
const router = express.Router();

router.route("/login").post(login);

// router.get("/get-users", adminController.getAllUsers);

// router.post("/searchUser", adminController.getUser);

// router.get("/delete-user/:id", adminController.deleteUser);

export default router;

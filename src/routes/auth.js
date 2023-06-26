import express from "express";
import { register,verify,login } from "../controllers/auth.js";
const router = express.Router();


router.route("/login").post(login);
router.route("/register").post(register);
router.route("/:id/verify/:token").get(verify)

export default router
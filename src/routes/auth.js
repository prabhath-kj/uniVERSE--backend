import express from "express";
import {verify,googleRegister,googleLogin,checkUserBlocked} from "../controllers/auth.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();



router.route("/:id/verify/:token").get(verify)
router.route("/google/login").post(googleLogin)
router.route("/google/register").post(googleRegister)
router.route("/validUser").get(authMiddleware,checkUserBlocked)

export default router
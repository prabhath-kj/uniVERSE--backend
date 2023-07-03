import express from "express";
import {verify,googleRegister,googleLogin} from "../controllers/auth.js";

const router = express.Router();



router.route("/:id/verify/:token").get(verify)
router.route("/google/login").post(googleLogin)
router.route("/google/register").post(googleRegister)

export default router
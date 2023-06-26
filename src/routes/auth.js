import express from "express";
import { login,register } from "../controllers/auth.js";


const router = express.Router();


router.route("/login").get(login).post(login);
router.route("/register").get(register).post(register);

export default router
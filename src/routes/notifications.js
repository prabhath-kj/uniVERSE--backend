import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {getNotifications} from "../controllers/notifications.js"
const router=express.Router()

router.route("/").get(authMiddleware,getNotifications)

// router.route("/notifications/cleanup").get(authMiddleware.cleanNotification)
export default router
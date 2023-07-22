import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {getNotifications,clearNotifications} from "../controllers/notifications.js"
const router=express.Router()

router.route("/").get(authMiddleware,getNotifications)
router.route("/delete").get(authMiddleware,clearNotifications)

// router.route("/notifications/cleanup").get(authMiddleware.cleanNotification)
export default router
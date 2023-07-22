import express from "express"
import {authMiddleware} from "../middleware/authMiddleware.js"
import {getMessage,postMessage} from "../controllers/message.js"
const router = express.Router()


router.route("/").post(authMiddleware,postMessage)

router.route("/:conversationId").get(authMiddleware,getMessage)

export default router
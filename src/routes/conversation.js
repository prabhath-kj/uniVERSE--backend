import express from "express"
import {authMiddleware} from "../middleware/authMiddleware.js"
import {initiateConversation,getConversation} from "../controllers/conversation.js"
const router = express.Router()


router.route("/").post(authMiddleware,initiateConversation)

router.route("/").get(authMiddleware,getConversation)

export default router
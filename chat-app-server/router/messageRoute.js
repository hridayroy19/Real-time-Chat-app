import express from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controller/messageController.js";
import { protectRoute } from "../meddilware/auth.js";


const messageRouter = express.Router();

// Get all users for sidebar (except current user)
messageRouter.get("/getusers", protectRoute, getUsersForSidebar);

// Get conversation messages between current user and selected user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark messages as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);  

export default messageRouter;
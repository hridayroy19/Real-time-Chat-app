import express from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controller/messageController";
import { protectRoute } from "../meddilware/auth";


const messageRouter = express.Router();

// Get all users for sidebar (except current user)
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get conversation messages between current user and selected user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark messages as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.put("/send/:id", protectRoute, sendMessage);  

export default messageRouter;
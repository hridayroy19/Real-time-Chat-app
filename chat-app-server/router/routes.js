import express from "express";
import { login, Signup, updateProfile } from "../controller/userController.js";
import { protectRoute } from "../meddilware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", Signup);
userRouter.post("/login", login);

// Protected routes (require authentication)
userRouter.put("/update-profile", protectRoute, updateProfile);

export default userRouter;

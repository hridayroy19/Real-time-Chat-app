import express from "express";
import "dotenv/config";
import cors from "cors";
import http from 'http'
import { connectDB } from "./lib/db.js";
import { Signup } from "./controller/userController.js";

// create express app and HTTP server
const app = express();
const server = http.createServer(app);

// meddileware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());


app.use('/status',(req , res)=>res.send('server is live'))
app.use('/register',Signup)

await connectDB()

const PORT = process.env.PORT || 5000

server.listen(PORT,()=>console.log("server site is runnign on PORT",+ PORT))
import { initializeSocket } from './socket';
import dotenv from 'dotenv';
import { connectDB } from "./db";
import express,{ Request, Response} from "express";
import http from "http";
import cookieParser from "cookie-parser";
import userRoutes from './router/user.route'
import messageRoutes from './router/message.route';

const app = express();
dotenv.config();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Example route
app.use("/user", userRoutes);
app.use("/message", messageRoutes);

connectDB();
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

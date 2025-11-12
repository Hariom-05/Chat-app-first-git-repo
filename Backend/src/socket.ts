import { Server, Socket } from "socket.io";
import http from "http";
import { saveMessage } from "./controllers/message.controller";

export const initializeSocket = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Handle private messages
    socket.on(
      "privateMessage",
      async (data: { senderId: string; receiverId: string; content: string }) => {
        const { senderId, receiverId, content } = data;

        try {
          // Save message to DB
          const savedMessage = await saveMessage(senderId, receiverId, content);

          // Emit message to the receiver if connected
          io.to(receiverId).emit("privateMessage", savedMessage);
        } catch (err) {
          console.error("Error saving or sending message:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  console.log("Socket.IO initialized");
  return io;
};

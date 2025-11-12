import { Request, Response } from "express";
import Message from "../models/message.module";

// ---------------- GET MESSAGES BETWEEN TWO USERS ----------------
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 }) // oldest to newest
      .populate("sender", "username email")
      .populate("receiver", "username email");

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

// ---------------- SAVE MESSAGE ----------------
export const saveMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await newMessage.save();
    return newMessage;
  } catch (err) {
    console.error("Error saving message:", err);
    throw new Error("Error saving message");
  }
};

import { Request, Response } from "express";
import User, { IUser } from "../models/user.module";

// Define login payload structure
interface LoginPayload {
  email: string;
  password: string;
}

// ---------------------- LOGIN ----------------------
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginPayload;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // Compare password
    const isMatch = await user.comparePassword(password.toString());
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = user.generateJWT();

    // Save token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------- REGISTER ----------------------
export const userRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as IUser;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Please fill all details" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Create new user (password will be hashed via pre-save hook)
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token
    const token = newUser.generateJWT();

    // Save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error in user registration" });
  }
};

// ---------------------- LOGOUT ----------------------
export const userLogout = (req: Request, res: Response): void => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Error during logout" });
  }
};


// ---------------------- GET ALL USERS ----------------------
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all users except passwords
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

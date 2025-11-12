import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}

//this is for the user authentication
export const authUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: "Access denied. No token provided." });
      return;
    }

    // Verify the token
    const secret = process.env.JWT_SECRET || "secretkey";
    const decoded = jwt.verify(token, secret);

    // Attach decoded user info to request
    req.user = decoded;

    // Continue to next middleware/route
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

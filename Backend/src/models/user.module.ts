import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateJWT(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

// Generate JWT token
userSchema.methods.generateJWT = function (): string {
  const user = this as IUser;
  const payload = { userId: user._id, email: user.email };
  const secret = process.env.JWT_SECRET || "secretkey";
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return token;
};

const User = model<IUser>("User", userSchema);

export default User;

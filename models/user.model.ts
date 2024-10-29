import mongoose, { Schema, Document } from "mongoose";
import { Credits } from "./credits.model";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  xProfile: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  credits?: mongoose.Schema.Types.ObjectId | Credits;
}

const userSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    xProfile: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?x\.com\/([A-Za-z0-9_]{1,15})\/?$/,
        "Valid X(Twitter) profile if required",
      ],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify code expiry date is required"],
    },
    credits: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Credits",
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;

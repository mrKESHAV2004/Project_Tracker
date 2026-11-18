import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  username?: string;
  password?: string;
  name?: string;
  role?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IUserDocument extends Document, Omit<IUser, "_id"> {}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      trim: true,
      default: "Keshav",
    },
    role: {
      type: String,
      enum: ["admin", "viewer"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;

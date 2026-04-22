import { UserRole, UserType } from "@/types/user";
import mongoose, { Schema, Model } from "mongoose";

export type UserDoc = mongoose.HydratedDocument<UserType>;

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: UserRole,
      required: true,
      default: UserRole.PA,
    },
  },
  { timestamps: true }
);

// Unique index on email
userSchema.index({ email: 1 }, { unique: true });

export const User: Model<UserType> =
  (mongoose.models.User as Model<UserType>) ||
  mongoose.model<UserType>("User", userSchema);

export default User;

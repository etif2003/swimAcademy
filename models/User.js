import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }, // בשרת תצפין עם bcrypt
    role: {
      type: String,
      enum: ["student", "instructor", "school", "admin"],
      default: "student",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);

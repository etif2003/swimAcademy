import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// 🔐 למנוע הרשמה כפולה
registrationSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

export const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

import mongoose from "mongoose";

const instructorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String, // לנוחות שליפה
  phone: String,
  experience: String, // שנות ניסיון
  certificates: [String], // רשימת לינקים לתעודות או שמות תעודות
  workArea: String, // אזור גאוגרפי
  hourlyRate: Number,
  image: { type: String }, // URL לתמונה
});

export const Instructor = mongoose.model("Instructor", instructorProfileSchema);

import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ["ילדים", "מבוגרים"], required: true },
  image: { type: String }, // URL לתמונה
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // מקשר למודל המשתמשים
    required: true,
  },
});

export const Course = mongoose.model("Course", courseSchema);

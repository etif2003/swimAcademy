import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // המשתמש שמנהל את ביה"ס
  name: { type: String, required: true },
  location: String,
  description: String,
  logo: String,
  contactName: String,
  contactPhone: String,
  image: { type: String }, // URL לתמונה
});

export const School = mongoose.model("School", schoolSchema);

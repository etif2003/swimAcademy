import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["ילדים", "מבוגרים"],
      required: true,
    },
    image: { type: String },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel",
    },

    createdByModel: {
      type: String,
      required: true,
      enum: ["Instructor", "School"],
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);

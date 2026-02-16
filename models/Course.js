import mongoose from "mongoose";
import { AREAS } from "../utils/constants/areas.js";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["All", "Learning", "Training", "Therapy"],
      required: true,
    },

    targetAudience: {
      type: String,
      enum: ["All", "Children", "Teens", "Adults", "Seniors"],
      required: true,
    },

    level: {
      type: String,
      enum: ["All", "Beginner", "Advanced", "Professional"],
      required: true,
    },

    image: {
      type: String,
      trim: true,
    },

    // Participants
    maxParticipants: {
      type: Number,
      min: 1,
    },

    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Course status
    status: {
      type: String,
      enum: ["Draft", "Active", "Inactive", "Completed"],
      default: "Active",
    },

    durationWeeks: {
      type: Number,
      min: 1,
    },

    sessionsCount: {
      type: Number,
      min: 1,
    },

    area: {
      type: String,
      enum: AREAS,
      required: true,
    },

    location: {
      poolName: { type: String, trim: true },
      city: { type: String, trim: true },
    },

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
  { timestamps: true },
);

//  Indexes for filtering and search
courseSchema.index({
  category: 1,
  targetAudience: 1,
  level: 1,
  status: 1,
  price: 1,
});

export const Course = mongoose.model("Course", courseSchema);

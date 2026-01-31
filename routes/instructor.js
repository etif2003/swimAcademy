import express from "express";
import {
  createInstructorController,
  getInstructorByUserController,
  getInstructorByIdController,
  getAllInstructorsController,
  updateInstructorController,
  deleteInstructorController,
} from "../controllers/instructor.js";

const router = express.Router();

/* =====================
   CREATE INSTRUCTOR PROFILE
===================== */
// יצירת פרופיל מדריך (לפי userId)
router.post("/", createInstructorController);

/* =====================
   GET INSTRUCTOR
===================== */

// שליפת פרופיל מדריך לפי userId
router.get("/by-user/:userId", getInstructorByUserController);

// שליפת פרופיל מדריך לפי instructorId
router.get("/:id", getInstructorByIdController);

// כל המדריכים
router.get("/", getAllInstructorsController);

/* =====================
   UPDATE INSTRUCTOR
===================== */
// עדכון פרופיל מדריך לפי instructorId
router.put("/:id", updateInstructorController);

/* =====================
   DELETE INSTRUCTOR
===================== */
// מחיקת פרופיל מדריך לפי instructorId
router.delete("/:id", deleteInstructorController);

export default router;

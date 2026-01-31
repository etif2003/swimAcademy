import express from "express";
import {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  getCoursesByCreatorController,
  updateCourseController,
  deleteCourseController,
} from "../controllers/Course.js";

const router = express.Router();

/* =====================
   CREATE COURSE
===================== */
// יצירת קורס (creatorId + creatorType מגיעים ב-body)
router.post("/", createCourseController);

/* =====================
   GET COURSES
===================== */

// כל הקורסים
router.get("/", getAllCoursesController);

// קורס לפי ID
router.get("/:id", getCourseByIdController);

// קורסים לפי יוצר (Instructor / School)
router.get(
  "/by-creator/:creatorType/:creatorId",
  getCoursesByCreatorController
);

/* =====================
   UPDATE COURSE
===================== */
// עדכון קורס לפי ID
router.put("/:id", updateCourseController);

/* =====================
   DELETE COURSE
===================== */
// מחיקת קורס לפי ID
router.delete("/:id", deleteCourseController);

export default router;

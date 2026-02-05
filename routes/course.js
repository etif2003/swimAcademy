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


// יצירת קורס 
router.post("/", createCourseController);

// כל הקורסים
router.get("/", getAllCoursesController);

// קורס לפי ID
router.get("/:id", getCourseByIdController);

// קורסים לפי יוצר (Instructor / School)
router.get(
  "/by-creator/type/:creatorType/id/:creatorId",
  getCoursesByCreatorController
);


// עדכון קורס לפי ID
router.put("/:id", updateCourseController);


// מחיקת קורס לפי ID
router.delete("/:id", deleteCourseController);

export default router;

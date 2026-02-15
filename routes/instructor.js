import express from "express";
import {
  createInstructorController,
  getInstructorByUserController,
  getInstructorByIdController,
  getAllInstructorsController,
  updateInstructorController,
  deleteInstructorController,
} from "../controllers/instructor.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();


// יצירת פרופיל מדריך (לפי userId)
router.post("/", authMiddleware, createInstructorController);



// שליפת פרופיל מדריך לפי userId
router.get("/by-user/:userId", authMiddleware, getInstructorByUserController);

// שליפת פרופיל מדריך לפי instructorId
router.get("/:id", getInstructorByIdController);

// כל המדריכים
router.get("/", getAllInstructorsController);


// עדכון פרופיל מדריך לפי instructorId
router.put("/:id", authMiddleware, updateInstructorController);


// מחיקת פרופיל מדריך לפי instructorId
router.delete("/:id", authMiddleware, deleteInstructorController);

export default router;

import express from "express";
import {
  createSchoolController,
  getSchoolByOwnerController,
  getSchoolByIdController,
  getAllSchoolsController,
  updateSchoolController,
  deleteSchoolController,
} from "../controllers/school.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// יצירת בית ספר 
router.post("/",authMiddleware, createSchoolController);


// שליפת בית ספר לפי owner 
router.get("/by-owner/:ownerId",authMiddleware, getSchoolByOwnerController);

// שליפת בית ספר לפי ID
router.get("/:id", getSchoolByIdController);

// כל בתי הספר
router.get("/", getAllSchoolsController);


// עדכון בית ספר לפי ID
router.put("/:id",authMiddleware, updateSchoolController);


// מחיקת בית ספר לפי ID
router.delete("/:id",authMiddleware, deleteSchoolController);

export default router;

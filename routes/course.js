import express from "express";
import {

} from "../controllers/Course.js";

const router = express.Router();

router.get("/", getAllCoursesController);
router.get("/id/:id", getCourseByIdController);
router.post("/", addCourseController);
router.delete("/id/:id", deleteCourseController);
router.put("/id/:id", updateCourseController);
router.put("/reset", resetCourseController);

export default router;

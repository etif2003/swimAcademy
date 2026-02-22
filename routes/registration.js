import express from "express";
import {
  createRegistrationController,
  getRegistrationsByUserController,
  getRegistrationsByCourseController,
  updateRegistrationStatusController,
  deleteRegistrationController,
} from "../controllers/registration.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();


// הרשמה לקורס 
router.post("/", createRegistrationController);


// כל ההרשמות של משתמש
router.get(
  "/by-user/:userId",authMiddleware,
  getRegistrationsByUserController
);

// כל ההרשמות לקורס
router.get(
  "/by-course/:courseId",authMiddleware,
  getRegistrationsByCourseController
);


// עדכון סטטוס הרשמה
router.put(
  "/:id/status",
  updateRegistrationStatusController
);


// ביטול הרשמה
router.delete("/:id", deleteRegistrationController);

export default router;

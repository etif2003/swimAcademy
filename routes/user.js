import express from "express";
import {
  registerController,
  loginController,
  changePasswordController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  updateUserRoleController,
  updateMyUserController,
  getMeController,
} from "../controllers/user.js";


import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// משתמש מחובר
router.get("/me", authMiddleware, getMeController);
router.put("/me", authMiddleware, updateMyUserController);
router.put("/change-password", authMiddleware, changePasswordController);

// admin
router.get("/", authMiddleware,  getAllUsersController);
router.get("/:id", authMiddleware,  getUserByIdController);
router.delete("/:id", authMiddleware,  deleteUserController);
router.put("/:id/role", authMiddleware,  updateUserRoleController);


export default router;

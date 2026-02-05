import {
  validateRequiredFields,
  validateEnum,
} from "./common.validators.js";
import { MESSAGES } from "../utils/constants/messages.js";

// =======================
// Domain enums
// =======================
export const ALLOWED_USER_ROLES = [
  "Student",
  "Instructor",
  "School",
  "Admin",
];

// =======================
// Email validation
// =======================
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error(MESSAGES.USER.INVALID_EMAIL);
  }
};

// =======================
// Password validation
// =======================
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw new Error(MESSAGES.USER.WEAK_PASSWORD);
  }
};

// =======================
// REGISTER validation
// =======================
export const validateRegisterPayload = (data) => {
  validateRequiredFields({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    password: data.password,
  });
};

// =======================
// ROLE validation
// =======================
export const validateUserRole = (role) => {
  validateEnum(
    role,
    ALLOWED_USER_ROLES,
    MESSAGES.USER.INVALID_ROLE
  );
};

import {
  validateRequiredFields,
  validateEnum,
} from "./common.validators.js";
import { MESSAGES } from "../utils/constants/messages.js";

// =======================
// Domain enums
// =======================
export const ALLOWED_REGISTRATION_STATUSES = [
  "Pending",
  "Paid",
  "Cancelled",
];

// =======================
// CREATE REGISTRATION validation
// =======================
export const validateCreateRegistrationPayload = (data) => {
  validateRequiredFields({
    userId: data.userId,
    courseId: data.courseId,
  });
};

// =======================
// UPDATE REGISTRATION STATUS validation
// =======================
export const validateRegistrationStatus = (status) => {
  validateEnum(
    status,
    ALLOWED_REGISTRATION_STATUSES,
    MESSAGES.REGISTRATION.INVALID_STATUS
  );
};

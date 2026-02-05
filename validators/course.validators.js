import {
  validateEnum,
  validateRequiredFields,
} from "./common.validators.js";
import { MESSAGES } from "../utils/constants/messages.js";

// =======================
// Domain enums
// =======================
export const ALLOWED_CREATORS = ["Instructor", "School"];
export const ALLOWED_CATEGORIES = [
  "Learning",
  "Training",
  "Therapy",
];

// =======================
// CREATE COURSE validation
// =======================
export const validateCreateCoursePayload = (data) => {
  validateRequiredFields({
    creatorId: data.creatorId,
    creatorType: data.creatorType,
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    targetAudience: data.targetAudience,
  });

  validateEnum(
    data.creatorType,
    ALLOWED_CREATORS,
    MESSAGES.COURSE.INVALID_CREATOR_TYPE
  );

  validateEnum(
    data.category,
    ALLOWED_CATEGORIES,
    MESSAGES.COURSE.INVALID_CATEGORY
  );

  if (typeof data.price !== "number" || data.price < 0) {
    throw new Error(MESSAGES.COURSE.INVALID_PRICE);
  }
};

// =======================
// UPDATE COURSE validation
// =======================
export const validateCourseCategory = (category) => {
  validateEnum(
    category,
    ALLOWED_CATEGORIES,
    MESSAGES.COURSE.INVALID_CATEGORY
  );
};

import {
  validateRequiredFields,
} from "./common.validators.js";
import { MESSAGES } from "../utils/constants/messages.js";

// =======================
// CREATE SCHOOL validation
// =======================
export const validateCreateSchoolPayload = (data) => {
  validateRequiredFields({
    ownerId: data.ownerId,
    name: data.name,
  });
};

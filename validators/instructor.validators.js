import {
  validateRequiredFields,
} from "./common.validators.js";

// =======================
// CREATE INSTRUCTOR validation
// =======================
export const validateCreateInstructorPayload = (data) => {
  validateRequiredFields({
    userId: data.userId,
    workArea: data.workArea,
  });
};

import {
  validateRequiredFields,
} from "./common.validators.js";

// =======================
// CREATE SCHOOL-INSTRUCTOR validation
// =======================
export const validateCreateSchoolInstructorPayload = (data) => {
  validateRequiredFields({
    instructorId: data.instructorId,
    schoolId: data.schoolId,
  });
};

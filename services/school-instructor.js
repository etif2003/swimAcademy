import { SchoolInstructor } from "../models/SchoolInstructor.js";
import { School } from "../models/School.js";
import { Instructor } from "../models/Instructor.js";
import { MESSAGES } from "../utils/constants/messages.js";

import {
  validateObjectId,
  validateNonEmptyUpdate,
} from "../validators/common.validators.js";

import {
  validateCreateSchoolInstructorPayload,
} from "../validators/schoolInstructor.validators.js";


// =======================
// CREATE SCHOOL INSTRUCTOR
// =======================
export const createSchoolInstructorService = async (data) => {
  validateCreateSchoolInstructorPayload(data);

  const {
    instructorId,
    schoolId,
    role,
    startDate,
    hoursPerWeek,
  } = data;

  validateObjectId(
    instructorId,
    MESSAGES.INSTRUCTOR.INVALID_ID
  );
  validateObjectId(
    schoolId,
    MESSAGES.SCHOOL.INVALID_ID
  );

  const instructorExists = await Instructor.exists({
    _id: instructorId,
  });
  if (!instructorExists) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  const schoolExists = await School.exists({
    _id: schoolId,
  });
  if (!schoolExists) {
    throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  const existing = await SchoolInstructor.exists({
    instructor: instructorId,
    school: schoolId,
  });

  if (existing) {
    throw new Error(
      MESSAGES.SCHOOL_INSTRUCTOR.ALREADY_EXISTS
    );
  }

  return SchoolInstructor.create({
    instructor: instructorId,
    school: schoolId,
    role,
    startDate,
    hoursPerWeek,
  });
};


// =======================
// GET INSTRUCTORS BY SCHOOL
// =======================
export const getInstructorsBySchoolService = async (schoolId) => {
  validateObjectId(
    schoolId,
    MESSAGES.SCHOOL.INVALID_ID
  );

  return SchoolInstructor.find({
    school: schoolId,
    status: "Active",
  })
    .populate("instructor")
    .sort({ createdAt: -1 });
};


// =======================
// GET SCHOOLS BY INSTRUCTOR
// =======================
export const getSchoolsByInstructorService = async (instructorId) => {
  validateObjectId(
    instructorId,
    MESSAGES.INSTRUCTOR.INVALID_ID
  );

  return SchoolInstructor.find({
    instructor: instructorId,
    status: "Active",
  })
    .populate("school")
    .sort({ createdAt: -1 });
};


// =======================
// UPDATE SCHOOL INSTRUCTOR
// =======================
export const updateSchoolInstructorService = async (id, data) => {
  validateObjectId(
    id,
    MESSAGES.SCHOOL_INSTRUCTOR.INVALID_ID
  );
  validateNonEmptyUpdate(data);

  const forbiddenFields = ["_id", "instructor", "school"];
  forbiddenFields.forEach((field) => delete data[field]);

  const record = await SchoolInstructor.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!record) {
    throw new Error(
      MESSAGES.SCHOOL_INSTRUCTOR.NOT_FOUND
    );
  }

  return record;
};


// =======================
// DELETE SCHOOL INSTRUCTOR
// =======================
export const deleteSchoolInstructorService = async (id) => {
  validateObjectId(
    id,
    MESSAGES.SCHOOL_INSTRUCTOR.INVALID_ID
  );

  const record = await SchoolInstructor.findById(id);
  if (!record) {
    throw new Error(
      MESSAGES.SCHOOL_INSTRUCTOR.NOT_FOUND
    );
  }

  record.status = "Inactive";
  await record.save();

  return {
    message: MESSAGES.SCHOOL_INSTRUCTOR.REMOVED_SUCCESS,
  };
};

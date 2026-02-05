import { Course } from "../models/Course.js";
import { Instructor } from "../models/Instructor.js";
import { School } from "../models/School.js";
import { Registration } from "../models/Registration.js";
import { MESSAGES } from "../utils/constants/messages.js";

import {
  validateObjectId,
  validateNonEmptyUpdate,
} from "../validators/common.validators.js";

import {
  validateCreateCoursePayload,
  validateCourseCategory,
} from "../validators/course.validators.js";


// =======================
// CREATE COURSE
// =======================
export const createCourseService = async (data) => {
  // payload-level validation
  validateCreateCoursePayload(data);

  // technical validation
  validateObjectId(
    data.creatorId,
    MESSAGES.COURSE.INVALID_CREATOR_ID
  );

  const {
    creatorId,
    creatorType,
    title,
    description,
    price,
    category,
    targetAudience,
    level,
    image,
  } = data;

  // check creator existence
  if (creatorType === "Instructor") {
    const exists = await Instructor.exists({ _id: creatorId });
    if (!exists) {
      throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
    }
  }

  if (creatorType === "School") {
    const exists = await School.exists({ _id: creatorId });
    if (!exists) {
      throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
    }
  }

  // prevent duplicate course per creator
  const courseExists = await Course.exists({
    title,
    createdBy: creatorId,
    createdByModel: creatorType,
  });

  if (courseExists) {
    throw new Error(MESSAGES.COURSE.ALREADY_EXISTS);
  }

  return Course.create({
    title,
    description,
    price,
    category,
    targetAudience,
    level,
    image,
    createdBy: creatorId,
    createdByModel: creatorType,
  });
};


// =======================
// GET ALL COURSES
// =======================
export const getAllCoursesService = async () => {
  return Course.find({ status: "Active" })
    .sort({ createdAt: -1 });
};


// =======================
// GET COURSE BY ID
// =======================
export const getCourseByIdService = async (courseId) => {
  validateObjectId(courseId, MESSAGES.COURSE.INVALID_ID);

  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

  return course;
};


// =======================
// GET COURSES BY CREATOR
// =======================
export const getCoursesByCreatorService = async ({
  creatorId,
  creatorType,
}) => {
  validateObjectId(
    creatorId,
    MESSAGES.COURSE.INVALID_CREATOR_ID
  );

  return Course.find({
    createdBy: creatorId,
    createdByModel: creatorType,
  }).sort({ createdAt: -1 });
};


// =======================
// UPDATE COURSE
// =======================
export const updateCourseService = async (
  courseId,
  data,
  user // req.user
) => {
  validateObjectId(courseId, MESSAGES.COURSE.INVALID_ID);
  validateNonEmptyUpdate(data);

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

  // ownership check
  if (
    course.createdBy.toString() !== user._id.toString() ||
    course.createdByModel !== user.role
  ) {
    throw new Error(MESSAGES.COURSE.NO_PERMISSION);
  }

  // forbidden fields
  const forbiddenFields = ["_id", "createdBy", "createdByModel"];
  forbiddenFields.forEach((field) => delete data[field]);

  // domain-level validations
  if (data.category) {
    validateCourseCategory(data.category);
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number" || data.price < 0) {
      throw new Error(MESSAGES.COURSE.INVALID_PRICE);
    }
  }

  return Course.findByIdAndUpdate(courseId, data, {
    new: true,
    runValidators: true,
  });
};


// =======================
// DELETE COURSE
// =======================
export const deleteCourseService = async (
  courseId,
  user // req.user
) => {
  validateObjectId(courseId, MESSAGES.COURSE.INVALID_ID);

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

  // ownership check
  if (
    course.createdBy.toString() !== user._id.toString() ||
    course.createdByModel !== user.role
  ) {
    throw new Error(MESSAGES.COURSE.NO_PERMISSION);
  }

  const registrations = await Registration.find({ course: courseId });
  if (registrations.length > 0) {
    course.status = "Inactive";
    await course.save();

    return {
      message: MESSAGES.COURSE.HAS_REGISTRATIONS,
    };
  }

  await course.deleteOne();

  return {
    message: MESSAGES.COURSE.DELETED_SUCCESS,
  };
};



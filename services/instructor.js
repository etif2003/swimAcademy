import { Instructor } from "../models/Instructor.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { MESSAGES } from "../utils/constants/messages.js";

import {
  validateObjectId,
  validateNonEmptyUpdate,
  validatePhone

} from "../validators/common.validators.js";

import {
  validateCreateInstructorPayload,
} from "../validators/instructor.validators.js";


// =======================
// CREATE INSTRUCTOR PROFILE
// =======================
export const createInstructorService = async (data) => {
  validateCreateInstructorPayload(data);
  validateObjectId(data.userId, MESSAGES.USER.INVALID_ID);

  const {
    userId,
    fullName,
    phone,
    experienceYears,
    certificates,
    workArea,
    hourlyRate,
    image,
  } = data;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  if (user.role !== "Instructor") {
    throw new Error(MESSAGES.INSTRUCTOR.USER_NOT_INSTRUCTOR);
  }

  const exists = await Instructor.exists({ user: userId });
  if (exists) {
    throw new Error(MESSAGES.INSTRUCTOR.ALREADY_EXISTS);
  }

  const instructorFullName = fullName || user.fullName;
  const instructorPhone = phone || user.phone;

  if (instructorPhone) {
    validatePhone(instructorPhone);
  }

  return Instructor.create({
    user: user._id,
    fullName: instructorFullName,
    phone: instructorPhone,
    experienceYears,
    certificates: certificates || [],
    workArea,
    hourlyRate,
    image,
    available: true,
  });
};


// =======================
// GET INSTRUCTOR BY USER
// =======================
export const getInstructorByUserService = async (userId) => {
  validateObjectId(userId, MESSAGES.USER.INVALID_ID);

  const instructor = await Instructor.findOne({ user: userId });

  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  return instructor;
};


// =======================
// GET ALL INSTRUCTORS
// =======================
export const getAllInstructorsService = async () => {
  return Instructor.find().sort({ createdAt: -1 });
};


// =======================
// GET INSTRUCTOR BY ID
// =======================
export const getInstructorByIdService = async (instructorId) => {
  validateObjectId(instructorId, MESSAGES.INSTRUCTOR.INVALID_ID);

  const instructor = await Instructor.findById(instructorId);

  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  return instructor;
};


// =======================
// UPDATE INSTRUCTOR
// =======================
export const updateInstructorService = async (instructorId, data) => {
  validateObjectId(instructorId, MESSAGES.INSTRUCTOR.INVALID_ID);
  validateNonEmptyUpdate(data);

  const forbiddenFields = ["_id", "user"];
  forbiddenFields.forEach((field) => delete data[field]);

  if (data.phone) {
    validatePhone(data.phone);
  }

  const instructor = await Instructor.findByIdAndUpdate(
    instructorId,
    data,
    { new: true, runValidators: true }
  );

  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  return instructor;
};


// =======================
// DELETE INSTRUCTOR
// =======================
export const deleteInstructorService = async (instructorId) => {
  validateObjectId(instructorId, MESSAGES.INSTRUCTOR.INVALID_ID);

  const instructor = await Instructor.findById(instructorId);
  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  const courses = await Course.find({ instructor: instructorId });
  if (courses.length > 0) {
    instructor.status = "Inactive";
    await instructor.save();

    return {
      message: MESSAGES.USER.INSTRUCTOR_HAS_COURSES,
    };
  }

  await instructor.deleteOne();

  return {
    message: MESSAGES.INSTRUCTOR.DELETED_SUCCESS,
  };
};


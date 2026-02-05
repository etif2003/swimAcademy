import { Registration } from "../models/Registration.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { MESSAGES } from "../utils/constants/messages.js";

import {
  validateObjectId,
} from "../validators/common.validators.js";

import {
  validateCreateRegistrationPayload,
  validateRegistrationStatus,
} from "../validators/registration.validators.js";


// =======================
// CREATE REGISTRATION
// =======================
export const createRegistrationService = async (data) => {
  validateCreateRegistrationPayload(data);

  const { userId, courseId } = data;

  validateObjectId(userId, MESSAGES.USER.INVALID_ID);
  validateObjectId(courseId, MESSAGES.COURSE.INVALID_ID);

  const user = await User.findById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

  // prevent duplicate registration
  const existingRegistration = await Registration.exists({
    student: userId,
    course: courseId,
  });

  if (existingRegistration) {
    throw new Error(MESSAGES.REGISTRATION.ALREADY_EXISTS);
  }

  if (course.status !== "Active") {
    throw new Error(MESSAGES.COURSE.NOT_ACTIVE);
  }

  if (
    course.maxParticipants &&
    course.currentParticipants >= course.maxParticipants
  ) {
    throw new Error(MESSAGES.COURSE.FULL);
  }

  course.currentParticipants += 1;
  await course.save();

  return Registration.create({
    student: userId,
    course: courseId,
  });
};


// =======================
// GET REGISTRATIONS BY USER
// =======================
export const getRegistrationsByUserService = async (userId) => {
  validateObjectId(userId, MESSAGES.USER.INVALID_ID);

  return Registration.find({ student: userId })
    .populate("course")
    .sort({ createdAt: -1 });
};


// =======================
// GET REGISTRATIONS BY COURSE
// =======================
export const getRegistrationsByCourseService = async (courseId) => {
  validateObjectId(courseId, MESSAGES.COURSE.INVALID_ID);

  return Registration.find({ course: courseId })
    .populate("student", "-password")
    .sort({ createdAt: -1 });
};


// =======================
// UPDATE REGISTRATION STATUS
// =======================
export const updateRegistrationStatusService = async (
  registrationId,
  status
) => {
  validateObjectId(
    registrationId,
    MESSAGES.REGISTRATION.INVALID_ID
  );

  validateRegistrationStatus(status);

  const registration = await Registration.findByIdAndUpdate(
    registrationId,
    { status },
    { new: true }
  );

  if (!registration) {
    throw new Error(MESSAGES.REGISTRATION.NOT_FOUND);
  }

  return registration;
};


// =======================
// DELETE REGISTRATION
// =======================
export const deleteRegistrationService = async (registrationId) => {
  validateObjectId(
    registrationId,
    MESSAGES.REGISTRATION.INVALID_ID
  );

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    throw new Error(MESSAGES.REGISTRATION.NOT_FOUND);
  }

  await registration.deleteOne();

  return {
    message: MESSAGES.REGISTRATION.CANCELLED_SUCCESS,
  };
};

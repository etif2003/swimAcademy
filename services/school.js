import { School } from "../models/School.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { MESSAGES } from "../utils/constants/messages.js";

import {
  validateObjectId,
  validateNonEmptyUpdate,
  validatePhone,
} from "../validators/common.validators.js";

import {
  validateCreateSchoolPayload,
} from "../validators/school.validators.js";


// =======================
// CREATE SCHOOL
// =======================
export const createSchoolService = async (data) => {
  validateCreateSchoolPayload(data);
  validateObjectId(data.ownerId, MESSAGES.USER.INVALID_ID);

  const {
    ownerId,
    name,
    location,
    description,
    logo,
    contactName,
    contactPhone,
    contactEmail,
    image,
  } = data;

  const user = await User.findById(ownerId);
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  if (user.role !== "School") {
    throw new Error(MESSAGES.SCHOOL.USER_NOT_SCHOOL);
  }

  const exists = await School.exists({ owner: ownerId });
  if (exists) {
    throw new Error(MESSAGES.SCHOOL.ALREADY_EXISTS);
  }

  if (contactPhone) {
    validatePhone(contactPhone);
  }

  return School.create({
    owner: ownerId,
    name,
    location: location || {},
    description,
    logo,
    contactName,
    contactPhone,
    contactEmail,
    image,
  });
};


// =======================
// GET SCHOOL BY OWNER
// =======================
export const getSchoolByOwnerService = async (ownerId) => {
  validateObjectId(ownerId, MESSAGES.USER.INVALID_ID);

  const school = await School.findOne({ owner: ownerId });
  if (!school) {
    throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  return school;
};


// =======================
// GET SCHOOL BY ID
// =======================
export const getSchoolByIdService = async (schoolId) => {
  validateObjectId(schoolId, MESSAGES.SCHOOL.INVALID_ID);

  const school = await School.findById(schoolId);
  if (!school) {
    throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  return school;
};


// =======================
// GET ALL SCHOOLS
// =======================
export const getAllSchoolsService = async () => {
  return School.find().sort({ createdAt: -1 });
};


// =======================
// UPDATE SCHOOL
// =======================
export const updateSchoolService = async (schoolId, data) => {
  validateObjectId(schoolId, MESSAGES.SCHOOL.INVALID_ID);
  validateNonEmptyUpdate(data);

  const forbiddenFields = ["_id", "owner"];
  forbiddenFields.forEach((field) => delete data[field]);

  if (data.contactPhone) {
    validatePhone(data.contactPhone);
  }

  const school = await School.findByIdAndUpdate(
    schoolId,
    data,
    { new: true }
  );

  if (!school) {
    throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  return school;
};


// =======================
// DELETE SCHOOL
// =======================
export const deleteSchoolService = async (schoolId) => {
  validateObjectId(schoolId, MESSAGES.SCHOOL.INVALID_ID);

  const school = await School.findById(schoolId);
  if (!school) {
    throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  const courses = await Course.find({ school: schoolId });
  if (courses.length > 0) {
    school.status = "Inactive";
    await school.save();

    return {
      message: MESSAGES.USER.SCHOOL_HAS_COURSES,
    };
  }

  await school.deleteOne();

  return {
    message: MESSAGES.SCHOOL.DELETED_SUCCESS,
  };
};

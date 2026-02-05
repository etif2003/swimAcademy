import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Registration } from "../models/Registration.js";
import { generateToken } from "../utils/jwt.js";
import { MESSAGES } from "../utils/constants/messages.js";

import {
  validateObjectId,
  validateNonEmptyUpdate,
  validatePhone,
} from "../validators/common.validators.js";

import {
  validateEmail,
  validatePassword,
  validateRegisterPayload,
  validateUserRole,
} from "../validators/user.validators.js";


// =======================
// REGISTER
// =======================
export const registerUserService = async (data) => {
  validateRegisterPayload(data);

  const { fullName, email, phone, password, role } = data;

  validateEmail(email);
  validatePhone(phone);
  validatePassword(password);

  const exists = await User.exists({ email });
  if (exists) {
    throw new Error(MESSAGES.USER.EMAIL_EXISTS);
  }

  if (role) {
    validateUserRole(role);
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await User.create({
    fullName,
    email,
    phone,
    password: hash,
    role,
  });

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};


// =======================
// LOGIN
// =======================
export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error(MESSAGES.AUTH.MISSING_CREDENTIALS);
  }

  validateEmail(email);

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};


// =======================
// CHANGE PASSWORD
// =======================
export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  validateObjectId(userId, MESSAGES.USER.INVALID_ID);

  if (!currentPassword || !newPassword) {
    throw new Error(MESSAGES.AUTH.MISSING_PASSWORDS);
  }

  validatePassword(newPassword);

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const isMatch = bcrypt.compareSync(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new Error(MESSAGES.AUTH.WRONG_PASSWORD);
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  user.password = hash;
  await user.save();

  return {
    message: MESSAGES.AUTH.PASSWORD_UPDATED,
  };
};


// =======================
// GET ALL USERS
// =======================
export const getAllUsersService = async () => {
  return User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};


// =======================
// GET USER BY ID
// =======================
export const getUserByIdService = async (userId) => {
  validateObjectId(userId, MESSAGES.USER.INVALID_ID);

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};


// =======================
// UPDATE USER
// =======================
export const updateUserService = async (userId, data) => {
  validateObjectId(userId, MESSAGES.USER.INVALID_ID);
  validateNonEmptyUpdate(data);

  const forbiddenFields = ["password", "role", "_id"];
  forbiddenFields.forEach((field) => delete data[field]);

  if (data.email) {
    validateEmail(data.email);

    const emailExists = await User.exists({
      email: data.email,
      _id: { $ne: userId },
    });

    if (emailExists) {
      throw new Error(MESSAGES.USER.EMAIL_EXISTS);
    }
  }

  if (data.phone) {
    validatePhone(data.phone);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    data,
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};


// =======================
// DELETE USER
// =======================
export const deleteUserService = async (userId) => {
  validateObjectId(userId, MESSAGES.USER.INVALID_ID);

  const user = await User.findById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  if (user.role === "Student") {
    const registrations = await Registration.find({
      student: userId,
    });

    if (registrations.length > 0) {
      user.status = "Inactive";
      await user.save();

      return {
        message: MESSAGES.USER.STUDENT_HAS_REGISTRATIONS,
      };
    }
  }

  if (user.role === "Instructor") {
    const courses = await Course.find({
      createdBy: userId,
      createdByModel: "Instructor",
    });

    if (courses.length > 0) {
      user.status = "Inactive";
      await user.save();

      return {
        message: MESSAGES.USER.INSTRUCTOR_HAS_COURSES,
      };
    }
  }

  if (user.role === "School") {
    const courses = await Course.find({
      createdBy: userId,
      createdByModel: "School",
    });

    if (courses.length > 0) {
      user.status = "Inactive";
      await user.save();

      return {
        message: MESSAGES.USER.SCHOOL_HAS_COURSES,
      };
    }
  }

  await user.deleteOne();

  return {
    message: MESSAGES.USER.DELETED_SUCCESS,
  };
};


// =======================
// UPDATE USER ROLE
// =======================
export const updateUserRoleService = async (userId, role) => {
  validateObjectId(userId, MESSAGES.USER.INVALID_ID);
  validateUserRole(role);

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};

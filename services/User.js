import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";
import { MESSAGES } from "../utils/constants/messages.js";


const allowedRoles = ["Student", "Instructor", "School"];

//helpers 
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isStrongPassword = (password) => {
  return password && password.length >= 6;
};

const isValidPhone = (phone) => {
  const regex = /^05\d{8}$/;
  return regex.test(phone);
};

//REGISTER
export const registerUserService = async ({
  fullName,
  email,
  phone,
  password,
  role,
}) => {
  if (!fullName || !email || !phone || !password) {
    throw new Error(MESSAGES.COMMON.MISSING_FIELDS);  }

  if (!isValidEmail(email)) {
    throw new Error(MESSAGES.USER.INVALID_EMAIL);
  }

  if (!isValidPhone(phone)) {
    throw new Error(MESSAGES.USER.INVALID_PHONE);
  }

  if (!isStrongPassword(password)) {
    throw new Error(MESSAGES.USER.WEAK_PASSWORD);
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(MESSAGES.USER.EMAIL_EXISTS);
  }

  if (role && !allowedRoles.includes(role)) {
    throw new Error(MESSAGES.USER.INVALID_ROLE);
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

//LOGIN
export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error(MESSAGES.AUTH.MISSING_CREDENTIALS);
  }

  if (!isValidEmail(email)) {
    throw new Error(MESSAGES.USER.INVALID_EMAIL);
  }

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

//CHANGE PASSWORD
export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  if (!currentPassword || !newPassword) {
    throw new Error(MESSAGES.AUTH.MISSING_PASSWORDS);
  }

  if (!isStrongPassword(newPassword)) {
    throw new Error(MESSAGES.USER.WEAK_PASSWORD);
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.password);

  if (!isMatch) {
    throw new Error(MESSAGES.AUTH.WRONG_PASSWORD);
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  user.password = hash;
  await user.save();

  return { message: MESSAGES.AUTH.PASSWORD_UPDATED};
};

//GET ALL USERS
export const getAllUsersService = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

//GET USER BY ID
export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};

//UPDATE USER
export const updateUserService = async (userId, data) => {
  if (!userId) {
    throw new Error(MESSAGES.USER.MISSING_USER_ID);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(MESSAGES.USER.INVALID_ID);
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error(MESSAGES.COMMON.NO_DATA_TO_UPDATE);
  }

  // שדות שאסור לעדכן
  const forbiddenFields = ["password", "role", "_id"];
  forbiddenFields.forEach((field) => {
    if (data[field]) {
      delete data[field];
    }
  });

  // ולידציית אימייל
  if (data.email) {
    if (!isValidEmail(data.email)) {
      throw new Error(MESSAGES.USER.INVALID_EMAIL);
    }

    const emailExists = await User.findOne({
      email: data.email,
      _id: { $ne: userId },
    });

    if (emailExists) {
      throw new Error(MESSAGES.USER.EMAIL_EXISTS);
    }
  }

  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error(MESSAGES.USER.INVALID_PHONE);
  }

  const user = await User.findByIdAndUpdate(userId, data, { new: true }).select(
    "-password",
  );

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};

//DELETE USER
export const deleteUserService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(MESSAGES.USER.INVALID_ID);
  }

  const user = await User.findById(userId);
  if (!user) throw new Error(MESSAGES.USER.NOT_FOUND);

  // בדיקות לפי סוג משתמש
  if (user.role === "Student") {
    const registrations = await Registration.find({ student: userId });
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
        message:
          MESSAGES.USER.SCHOOL_HAS_COURSES,
      };
    }
  }

  // אין קשרים – אפשר למחוק
  await user.deleteOne();
  return { message: MESSAGES.USER.DELETED_SUCCESS };
};

//UPDATE USER ROLE
export const updateUserRoleService = async (userId, role) => {
  const allowedRoles = ["Student", "Instructor", "School", "Admin"];

  if (!allowedRoles.includes(role)) {
    throw new Error(MESSAGES.USER.INVALID_ROLE);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  ).select("-password");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};

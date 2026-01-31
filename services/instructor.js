import mongoose from "mongoose";
import { Instructor } from "../models/Instructor.js";
import { User } from "../models/User.js";

/* ===== helpers ===== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidPhone = (phone) => {
  const regex = /^05\d{8}$/;
  return regex.test(phone);
};

/* =====================
   CREATE INSTRUCTOR PROFILE
===================== */
export const createInstructorService = async ({
  userId,
  fullName,
  phone,
  experience,
  certificates,
  workArea,
  hourlyRate,
  image,
}) => {
  if (!userId) {
    throw new Error("מזהה משתמש חסר");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("מזהה משתמש לא תקין");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("משתמש לא נמצא");
  }

  if (user.role !== "instructor") {
    throw new Error("המשתמש אינו מדריך");
  }

  const existingInstructor = await Instructor.findOne({ user: userId });
  if (existingInstructor) {
    throw new Error("כבר קיים פרופיל מדריך למשתמש זה");
  }

  if (!experience || !workArea || !hourlyRate) {
    throw new Error("חסרים פרטי חובה לפרופיל מדריך");
  }

  const instructorFullName = fullName || user.fullName;
  const instructorPhone = phone || user.phone;

  if (instructorPhone && !isValidPhone(instructorPhone)) {
    throw new Error("מספר הטלפון אינו תקין");
  }

  const instructor = await Instructor.create({
    user: user._id,
    fullName: instructorFullName,
    phone: instructorPhone,
    experience,
    certificates: certificates || [],
    workArea,
    hourlyRate,
    image,
  });

  return instructor;
};

/* =====================
   GET INSTRUCTOR BY USER
===================== */
export const getInstructorByUserService = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error("מזהה משתמש לא תקין");
  }

  const instructor = await Instructor.findOne({ user: userId });

  if (!instructor) {
    throw new Error("פרופיל מדריך לא נמצא");
  }

  return instructor;
};

/* =====================
   GET INSTRUCTOR BY ID
===================== */
export const getInstructorByIdService = async (instructorId) => {
  if (!isValidObjectId(instructorId)) {
    throw new Error("מזהה מדריך לא תקין");
  }

  const instructor = await Instructor.findById(instructorId);

  if (!instructor) {
    throw new Error("מדריך לא נמצא");
  }

  return instructor;
};

/* =====================
   GET ALL INSTRUCTORS
===================== */
export const getAllInstructorsService = async () => {
  return Instructor.find().sort({ createdAt: -1 });
};

/* =====================
   UPDATE INSTRUCTOR
===================== */
export const updateInstructorService = async (instructorId, data) => {
  if (!isValidObjectId(instructorId)) {
    throw new Error("מזהה מדריך לא תקין");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("לא נשלחו נתונים לעדכון");
  }

  // שדות שאסור לעדכן
  const forbiddenFields = ["_id", "user"];
  forbiddenFields.forEach((field) => {
    if (field in data) {
      delete data[field];
    }
  });

  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error("מספר הטלפון אינו תקין");
  }

  const instructor = await Instructor.findByIdAndUpdate(
    instructorId,
    data,
    { new: true }
  );

  if (!instructor) {
    throw new Error("מדריך לא נמצא");
  }

  return instructor;
};

/* =====================
   DELETE INSTRUCTOR
===================== */
export const deleteInstructorService = async (instructorId) => {
  if (!isValidObjectId(instructorId)) {
    throw new Error("מזהה מדריך לא תקין");
  }

  const instructor = await Instructor.findById(instructorId);
  if (!instructor) {
    throw new Error("מדריך לא נמצא");
  }

  await instructor.deleteOne();

  return { message: "פרופיל המדריך נמחק בהצלחה" };
};

import mongoose from "mongoose";
import { Registration } from "../models/Registration.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";

/* ===== helpers ===== */

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const allowedStatuses = ["Pending", "Paid", "Cancelled"];

/* =====================
   CREATE REGISTRATION
===================== */
export const createRegistrationService = async ({
  userId,
  courseId,
}) => {
  if (!userId || !courseId) {
    throw new Error("חסרים פרטי הרשמה");
  }

  if (!isValidObjectId(userId) || !isValidObjectId(courseId)) {
    throw new Error("מזהה משתמש או קורס לא תקין");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("משתמש לא נמצא");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("קורס לא נמצא");
  }

  // מניעת הרשמה כפולה
  const existingRegistration = await Registration.findOne({
    student: userId,
    course: courseId,
  });

  if (existingRegistration) {
    throw new Error("המשתמש כבר רשום לקורס זה");
  }

  if (course.status !== "Active") {
    throw new Error("לא ניתן להירשם לקורס לא פעיל");
  }

  if (
    course.maxParticipants &&
    course.currentParticipants >= course.maxParticipants
  ) {
    throw new Error("הקורס מלא");
  }

  course.currentParticipants += 1;
  await course.save();

  const registration = await Registration.create({
    student: userId,
    course: courseId,
  });

  return registration;
};

/* =====================
   GET REGISTRATIONS BY USER
===================== */
export const getRegistrationsByUserService = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error("מזהה משתמש לא תקין");
  }

  return Registration.find({ student: userId })
    .populate("course")
    .sort({ createdAt: -1 });
};

/* =====================
   GET REGISTRATIONS BY COURSE
===================== */
export const getRegistrationsByCourseService = async (courseId) => {
  if (!isValidObjectId(courseId)) {
    throw new Error("מזהה קורס לא תקין");
  }

  return Registration.find({ course: courseId })
    .populate("student", "-password")
    .sort({ createdAt: -1 });
};

/* =====================
   UPDATE REGISTRATION STATUS
===================== */
export const updateRegistrationStatusService = async (
  registrationId,
  status
) => {
  if (!isValidObjectId(registrationId)) {
    throw new Error("מזהה הרשמה לא תקין");
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error("סטטוס הרשמה לא חוקי");
  }

  const registration = await Registration.findByIdAndUpdate(
    registrationId,
    { status },
    { new: true }
  );

  if (!registration) {
    throw new Error("הרשמה לא נמצאה");
  }

  return registration;
};

/* =====================
   DELETE REGISTRATION
===================== */
export const deleteRegistrationService = async (registrationId) => {
  if (!isValidObjectId(registrationId)) {
    throw new Error("מזהה הרשמה לא תקין");
  }

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    throw new Error("הרשמה לא נמצאה");
  }

  await registration.deleteOne();

  return { message: "ההרשמה בוטלה בהצלחה" };
};

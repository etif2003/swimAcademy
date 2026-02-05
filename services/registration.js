import mongoose from "mongoose";
import { Registration } from "../models/Registration.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { MESSAGES } from "../utils/constants/messages.js";

//helpers
const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const allowedStatuses = ["Pending", "Paid", "Cancelled"];

 //  CREATE REGISTRATION
export const createRegistrationService = async ({
  userId,
  courseId,
}) => {
  if (!userId || !courseId) {
    throw new Error(MESSAGES.REGISTRATION.MISSING_FIELDS);
  }

  if (!isValidObjectId(userId) || !isValidObjectId(courseId)) {
    throw new Error(MESSAGES.COMMON.INVALID_ID);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

  // מניעת הרשמה כפולה
  const existingRegistration = await Registration.findOne({
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

  const registration = await Registration.create({
    student: userId,
    course: courseId,
  });

  return registration;
};

  // GET REGISTRATIONS BY USER
export const getRegistrationsByUserService = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error(MESSAGES.USER.INVALID_ID);
  }

  return Registration.find({ student: userId })
    .populate("course")
    .sort({ createdAt: -1 });
};

  // GET REGISTRATIONS BY COURSE
export const getRegistrationsByCourseService = async (courseId) => {
  if (!isValidObjectId(courseId)) {
    throw new Error(MESSAGES.COURSE.INVALID_ID);
  }

  return Registration.find({ course: courseId })
    .populate("student", "-password")
    .sort({ createdAt: -1 });
};

 //  UPDATE REGISTRATION STATUS
export const updateRegistrationStatusService = async (
  registrationId,
  status
) => {
  if (!isValidObjectId(registrationId)) {
    throw new Error(MESSAGES.REGISTRATION.INVALID_ID);
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error(MESSAGES.REGISTRATION.INVALID_STATUS);
  }

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

  // DELETE REGISTRATION
export const deleteRegistrationService = async (registrationId) => {
  if (!isValidObjectId(registrationId)) {
    throw new Error(MESSAGES.REGISTRATION.INVALID_ID);
  }

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    throw new Error(MESSAGES.REGISTRATION.NOT_FOUND);
  }

  await registration.deleteOne();

  return { message: MESSAGES.REGISTRATION.CANCELLED_SUCCESS };
};


// import mongoose from "mongoose";
// import { Registration } from "../models/Registration.js";
// import { User } from "../models/User.js";
// import { Course } from "../models/Course.js";

// //helpers
// const isValidObjectId = (id) =>
//   mongoose.Types.ObjectId.isValid(id);

// const allowedStatuses = ["Pending", "Paid", "Cancelled"];

//  //  CREATE REGISTRATION
// export const createRegistrationService = async ({
//   userId,
//   courseId,
// }) => {
//   if (!userId || !courseId) {
//     throw new Error("חסרים פרטי הרשמה");
//   }

//   if (!isValidObjectId(userId) || !isValidObjectId(courseId)) {
//     throw new Error("מזהה משתמש או קורס לא תקין");
//   }

//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error("משתמש לא נמצא");
//   }

//   const course = await Course.findById(courseId);
//   if (!course) {
//     throw new Error("קורס לא נמצא");
//   }

//   // מניעת הרשמה כפולה
//   const existingRegistration = await Registration.findOne({
//     student: userId,
//     course: courseId,
//   });

//   if (existingRegistration) {
//     throw new Error("המשתמש כבר רשום לקורס זה");
//   }

//   if (course.status !== "Active") {
//     throw new Error("לא ניתן להירשם לקורס לא פעיל");
//   }

//   if (
//     course.maxParticipants &&
//     course.currentParticipants >= course.maxParticipants
//   ) {
//     throw new Error("הקורס מלא");
//   }

//   course.currentParticipants += 1;
//   await course.save();

//   const registration = await Registration.create({
//     student: userId,
//     course: courseId,
//   });

//   return registration;
// };

//   // GET REGISTRATIONS BY USER
// export const getRegistrationsByUserService = async (userId) => {
//   if (!isValidObjectId(userId)) {
//     throw new Error("מזהה משתמש לא תקין");
//   }

//   return Registration.find({ student: userId })
//     .populate("course")
//     .sort({ createdAt: -1 });
// };

//   // GET REGISTRATIONS BY COURSE
// export const getRegistrationsByCourseService = async (courseId) => {
//   if (!isValidObjectId(courseId)) {
//     throw new Error("מזהה קורס לא תקין");
//   }

//   return Registration.find({ course: courseId })
//     .populate("student", "-password")
//     .sort({ createdAt: -1 });
// };

//  //  UPDATE REGISTRATION STATUS
// export const updateRegistrationStatusService = async (
//   registrationId,
//   status
// ) => {
//   if (!isValidObjectId(registrationId)) {
//     throw new Error("מזהה הרשמה לא תקין");
//   }

//   if (!allowedStatuses.includes(status)) {
//     throw new Error("סטטוס הרשמה לא חוקי");
//   }

//   const registration = await Registration.findByIdAndUpdate(
//     registrationId,
//     { status },
//     { new: true }
//   );

//   if (!registration) {
//     throw new Error("הרשמה לא נמצאה");
//   }

//   return registration;
// };

//   // DELETE REGISTRATION
// export const deleteRegistrationService = async (registrationId) => {
//   if (!isValidObjectId(registrationId)) {
//     throw new Error("מזהה הרשמה לא תקין");
//   }

//   const registration = await Registration.findById(registrationId);
//   if (!registration) {
//     throw new Error("הרשמה לא נמצאה");
//   }

//   await registration.deleteOne();

//   return { message: "ההרשמה בוטלה בהצלחה" };
// };

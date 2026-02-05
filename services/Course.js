import mongoose from "mongoose";
import { Course } from "../models/Course.js";
import { Instructor } from "../models/Instructor.js";
import { School } from "../models/School.js";
import { Registration } from "../models/Registration.js";
import { MESSAGES } from "../utils/constants/messages.js";

//helpers
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const allowedCreators = ["Instructor", "School"];
const allowedCategories = ["Learning", "Training", "Therapy"];

export const createCourseService = async ({
  creatorId,
  creatorType, // "Instructor" \ "School"
  title,
  description,
  price,
  category,
  targetAudience,
  level,
  image,
}) => {
  if (!creatorId || !creatorType) {
    throw new Error(MESSAGES.COURSE.MISSING_CREATOR);
  }

  if (!isValidObjectId(creatorId)) {
    throw new Error(MESSAGES.COURSE.INVALID_CREATOR_ID);
  }

  if (!allowedCreators.includes(creatorType)) {
    throw new Error(MESSAGES.COURSE.INVALID_CREATOR_TYPE);
  }

  if (
    !title ||
    !description ||
    price === undefined ||
    !category ||
    !targetAudience
  ) {
    throw new Error(MESSAGES.COMMON.MISSING_FIELDS);
  }

  if (!allowedCategories.includes(category)) {
    throw new Error(MESSAGES.COURSE.INVALID_CATEGORY);
  }

  if (typeof price !== "number" || price < 0) {
    throw new Error(MESSAGES.COURSE.INVALID_PRICE);
  }

  // בדיקה שהיוצר קיים
  if (creatorType === "Instructor") {
    const instructor = await Instructor.findById(creatorId);
    if (!instructor) throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  if (creatorType === "School") {
    const school = await School.findById(creatorId);
    if (!school) throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  // מניעת קורס כפול לאותו יוצר
  const existingCourse = await Course.findOne({
    title,
    createdBy: creatorId,
    createdByModel: creatorType,
  });

  if (existingCourse) {
    throw new Error(MESSAGES.COURSE.ALREADY_EXISTS);
  }

  const course = await Course.create({
    title,
    description,
    price,
    category,
    targetAudience,
    level,
    image,
    status: "Draft",
    createdBy: creatorId,
    createdByModel: creatorType,
  });

  return course;
};

  // GET ALL COURSES
export const getAllCoursesService = async () => {
  return Course.find({ status: "Active" }).sort({ createdAt: -1 });
};

  // GET COURSE BY ID
export const getCourseByIdService = async (courseId) => {
  if (!isValidObjectId(courseId)) {
    throw new Error(MESSAGES.COURSE.INVALID_ID);
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

  return course;
};

   //GET COURSES BY CREATOR
export const getCoursesByCreatorService = async ({
  creatorId,
  creatorType,
}) => {
  if (!isValidObjectId(creatorId)) {
    throw new Error(MESSAGES.COURSE.INVALID_CREATOR_ID);
  }

  if (!allowedCreators.includes(creatorType)) {
    throw new Error(MESSAGES.COURSE.INVALID_CREATOR_TYPE);
  }

  return Course.find({
    createdBy: creatorId,
    createdByModel: creatorType,
  }).sort({ createdAt: -1 });
};

  // UPDATE COURSE
export const updateCourseService = async (
  courseId,
  data,
  user, // req.user
) => {
  if (!isValidObjectId(courseId)) {
    throw new Error(MESSAGES.COURSE.INVALID_ID);
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error(MESSAGES.COMMON.NO_DATA_TO_UPDATE);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

  //  בדיקת בעלות
  if (
    course.createdBy.toString() !== user._id.toString() ||
    course.createdByModel !== user.role
  ) {
    throw new Error(MESSAGES.COURSE.NO_PERMISSION);
  }

  // שדות שאסור לעדכן
  const forbiddenFields = ["_id", "createdBy", "createdByModel"];
  forbiddenFields.forEach((field) => delete data[field]);

  if (data.category && !allowedCategories.includes(data.category)) {
    throw new Error(MESSAGES.COURSE.INVALID_CATEGORY);
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number" || data.price < 0) {
      throw new Error(MESSAGES.COURSE.INVALID_PRICE);
    }
  }

  const updatedCourse = await Course.findByIdAndUpdate(courseId, data, {
    new: true,
    runValidators: true,
  });

  return updatedCourse;
};

   //DELETE COURSE
export const deleteCourseService = async (
  courseId,
  user, // req.user
) => {
  if (!isValidObjectId(courseId)) {
    throw new Error(MESSAGES.COURSE.INVALID_ID);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error(MESSAGES.COURSE.NOT_FOUND);
  }

   //  בדיקת בעלות
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

  return { message: MESSAGES.COURSE.DELETED_SUCCESS };
};



// import mongoose from "mongoose";
// import { Course } from "../models/Course.js";
// import { Instructor } from "../models/Instructor.js";
// import { School } from "../models/School.js";
// import { Registration } from "../models/Registration.js";

// //helpers
// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// const allowedCreators = ["Instructor", "School"];
// const allowedCategories = ["Learning", "Training", "Therapy"];

// export const createCourseService = async ({
//   creatorId,
//   creatorType, // "Instructor" \ "School"
//   title,
//   description,
//   price,
//   category,
//   targetAudience,
//   level,
//   image,
// }) => {
//   if (!creatorId || !creatorType) {
//     throw new Error("חסר יוצר לקורס");
//   }

//   if (!isValidObjectId(creatorId)) {
//     throw new Error("מזהה יוצר לא תקין");
//   }

//   if (!allowedCreators.includes(creatorType)) {
//     throw new Error("סוג יוצר לא חוקי");
//   }

//   if (
//     !title ||
//     !description ||
//     price === undefined ||
//     !category ||
//     !targetAudience
//   ) {
//     throw new Error("חסרים שדות חובה לקורס");
//   }

//   if (!allowedCategories.includes(category)) {
//     throw new Error("קטגוריית קורס לא חוקית");
//   }

//   if (typeof price !== "number" || price < 0) {
//     throw new Error("מחיר הקורס אינו תקין");
//   }

//   // בדיקה שהיוצר קיים
//   if (creatorType === "Instructor") {
//     const instructor = await Instructor.findById(creatorId);
//     if (!instructor) throw new Error("מדריך לא נמצא");
//   }

//   if (creatorType === "School") {
//     const school = await School.findById(creatorId);
//     if (!school) throw new Error("בית ספר לא נמצא");
//   }

//   // מניעת קורס כפול לאותו יוצר
//   const existingCourse = await Course.findOne({
//     title,
//     createdBy: creatorId,
//     createdByModel: creatorType,
//   });

//   if (existingCourse) {
//     throw new Error("כבר קיים קורס עם שם זה");
//   }

//   const course = await Course.create({
//     title,
//     description,
//     price,
//     category,
//     targetAudience,
//     level,
//     image,
//     status: "Draft",
//     createdBy: creatorId,
//     createdByModel: creatorType,
//   });

//   return course;
// };

//   // GET ALL COURSES
// export const getAllCoursesService = async () => {
//   return Course.find({ status: "Active" }).sort({ createdAt: -1 });
// };

//   // GET COURSE BY ID
// export const getCourseByIdService = async (courseId) => {
//   if (!isValidObjectId(courseId)) {
//     throw new Error("מזהה קורס לא תקין");
//   }

//   const course = await Course.findById(courseId);

//   if (!course) {
//     throw new Error("קורס לא נמצא");
//   }

//   return course;
// };

//    //GET COURSES BY CREATOR
// export const getCoursesByCreatorService = async ({
//   creatorId,
//   creatorType,
// }) => {
//   if (!isValidObjectId(creatorId)) {
//     throw new Error("מזהה יוצר לא תקין");
//   }

//   if (!allowedCreators.includes(creatorType)) {
//     throw new Error("סוג יוצר לא חוקי");
//   }

//   return Course.find({
//     createdBy: creatorId,
//     createdByModel: creatorType,
//   }).sort({ createdAt: -1 });
// };

//   // UPDATE COURSE
// export const updateCourseService = async (
//   courseId,
//   data,
//   user, // req.user
// ) => {
//   if (!isValidObjectId(courseId)) {
//     throw new Error("מזהה קורס לא תקין");
//   }

//   if (!data || Object.keys(data).length === 0) {
//     throw new Error("לא נשלחו נתונים לעדכון");
//   }

//   const course = await Course.findById(courseId);
//   if (!course) {
//     throw new Error("קורס לא נמצא");
//   }

//   //  בדיקת בעלות
//   if (
//     course.createdBy.toString() !== user._id.toString() ||
//     course.createdByModel !== user.role
//   ) {
//     throw new Error("אין הרשאה לעדכן קורס זה");
//   }

//   // שדות שאסור לעדכן
//   const forbiddenFields = ["_id", "createdBy", "createdByModel"];
//   forbiddenFields.forEach((field) => delete data[field]);

//   if (data.category && !allowedCategories.includes(data.category)) {
//     throw new Error("קטגוריית קורס לא חוקית");
//   }

//   if (data.price !== undefined) {
//     if (typeof data.price !== "number" || data.price < 0) {
//       throw new Error("מחיר הקורס אינו תקין");
//     }
//   }

//   const updatedCourse = await Course.findByIdAndUpdate(courseId, data, {
//     new: true,
//     runValidators: true,
//   });

//   return updatedCourse;
// };

//    //DELETE COURSE

// export const deleteCourseService = async (
//   courseId,
//   user, // req.user
// ) => {
//   if (!isValidObjectId(courseId)) {
//     throw new Error("מזהה קורס לא תקין");
//   }

//   const course = await Course.findById(courseId);
//   if (!course) {
//     throw new Error("קורס לא נמצא");
//   }

//    //  בדיקת בעלות
//   if (
//     course.createdBy.toString() !== user._id.toString() ||
//     course.createdByModel !== user.role
//   ) {
//     throw new Error("אין הרשאה למחוק קורס זה");
//   }

//   const registrations = await Registration.find({ course: courseId });
//   if (registrations.length > 0) {
//     course.status = "Inactive"; 
//     await course.save();
//     return { message: "הקורס לא נמחק כי יש הרשמות, הסטטוס הועבר ל'לא פעיל'" };
//   }

//   await course.deleteOne();

//   return { message: "הקורס נמחק בהצלחה" };
// };

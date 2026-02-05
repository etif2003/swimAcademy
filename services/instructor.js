import mongoose from "mongoose";
import { Instructor } from "../models/Instructor.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { MESSAGES } from "../utils/constants/messages.js";

//helpers 
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidPhone = (phone) => {
  const regex = /^05\d{8}$/;
  return regex.test(phone);
};

   //CREATE INSTRUCTOR PROFILE
export const createInstructorService = async ({
  userId,
  fullName,
  phone,
  experienceYears,
  certificates,
  workArea,
  hourlyRate,
  image,
}) => {
  if (!userId) {
    throw new Error(MESSAGES.USER.MISSING_USER_ID);
  }

  if (!isValidObjectId(userId)) {
    throw new Error(MESSAGES.USER.INVALID_ID);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  if (user.role !== "Instructor") {
    throw new Error(MESSAGES.INSTRUCTOR.USER_NOT_INSTRUCTOR);
  }

  const existingInstructor = await Instructor.findOne({ user: userId });
  if (existingInstructor) {
    throw new Error(MESSAGES.INSTRUCTOR.ALREADY_EXISTS);
  }

  if (!workArea) {
    throw new Error(MESSAGES.INSTRUCTOR.MISSING_REQUIRED_FIELDS);
  }

  const instructorFullName = fullName || user.fullName;
  const instructorPhone = phone || user.phone;

  if (instructorPhone && !isValidPhone(instructorPhone)) {
    throw new Error(MESSAGES.USER.INVALID_PHONE);
  }

  const instructor = await Instructor.create({
    user: user._id,
    fullName: instructorFullName,
    phone: instructorPhone,
    experienceYears,
    certificates: certificates || [],
    workArea,
    hourlyRate,
    image,
    status: "Draft", // ברירת מחדל מהמודל
    available: true,
  });

  return instructor;
};

  // GET INSTRUCTOR BY USER
export const getInstructorByUserService = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error(MESSAGES.USER.INVALID_ID);
  }

  const instructor = await Instructor.findOne({ user: userId });

  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  return instructor;
};

  // GET ALL INSTRUCTORS
export const getAllInstructorsService = async () => {
  return Instructor.find().sort({ createdAt: -1 });
};

   //GET INSTRUCTOR BY ID
export const getInstructorByIdService = async (instructorId) => {
  if (!isValidObjectId(instructorId)) {
    throw new Error(MESSAGES.INSTRUCTOR.INVALID_ID);
  }

  const instructor = await Instructor.findById(instructorId);

  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  return instructor;
};

   //UPDATE INSTRUCTOR
export const updateInstructorService = async (instructorId, data) => {
  if (!isValidObjectId(instructorId)) {
    throw new Error(MESSAGES.INSTRUCTOR.INVALID_ID);
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error(MESSAGES.COMMON.NO_DATA_TO_UPDATE);
  }

  // שדות שאסור לעדכן
  const forbiddenFields = ["_id", "user"];
  forbiddenFields.forEach((field) => {
    if (field in data) {
      delete data[field];
    }
  });

  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error(MESSAGES.USER.INVALID_PHONE);
  }

  const instructor = await Instructor.findByIdAndUpdate(instructorId, data, {
    new: true,
    runValidators: true,
  });

  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  return instructor;
};

  // DELETE INSTRUCTOR
export const deleteInstructorService = async (instructorId) => {
  if (!isValidObjectId(instructorId)) {
    throw new Error(MESSAGES.INSTRUCTOR.INVALID_ID);
  }

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

  return { message: MESSAGES.INSTRUCTOR.DELETED_SUCCESS };
};


// import mongoose from "mongoose";
// import { Instructor } from "../models/Instructor.js";
// import { User } from "../models/User.js";

// //helpers 
// const isValidObjectId = (id) => {
//   return mongoose.Types.ObjectId.isValid(id);
// };

// const isValidPhone = (phone) => {
//   const regex = /^05\d{8}$/;
//   return regex.test(phone);
// };

//    //CREATE INSTRUCTOR PROFILE

// export const createInstructorService = async ({
//   userId,
//   fullName,
//   phone,
//   experienceYears,
//   certificates,
//   workArea,
//   hourlyRate,
//   image,
// }) => {
//   if (!userId) {
//     throw new Error("מזהה משתמש חסר");
//   }

//   if (!isValidObjectId(userId)) {
//     throw new Error("מזהה משתמש לא תקין");
//   }

//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error("משתמש לא נמצא");
//   }

//   if (user.role !== "Instructor") {
//     throw new Error("המשתמש אינו רשום כמדריך");
//   }

//   const existingInstructor = await Instructor.findOne({ user: userId });
//   if (existingInstructor) {
//     throw new Error("כבר קיים פרופיל מדריך למשתמש זה");
//   }

//   if (!workArea) {
//     throw new Error("חסרים פרטי חובה לפרופיל מדריך");
//   }

//   const instructorFullName = fullName || user.fullName;
//   const instructorPhone = phone || user.phone;

//   if (instructorPhone && !isValidPhone(instructorPhone)) {
//     throw new Error("מספר הטלפון אינו תקין");
//   }

//   const instructor = await Instructor.create({
//     user: user._id,
//     fullName: instructorFullName,
//     phone: instructorPhone,
//     experienceYears,
//     certificates: certificates || [],
//     workArea,
//     hourlyRate,
//     image,
//     status: "Draft", // ברירת מחדל מהמודל
//     available: true,
//   });

//   return instructor;
// };

//   // GET INSTRUCTOR BY USER

// export const getInstructorByUserService = async (userId) => {
//   if (!isValidObjectId(userId)) {
//     throw new Error("מזהה משתמש לא תקין");
//   }

//   const instructor = await Instructor.findOne({ user: userId });

//   if (!instructor) {
//     throw new Error("פרופיל מדריך לא נמצא");
//   }

//   return instructor;
// };

//   // GET ALL INSTRUCTORS
// export const getAllInstructorsService = async () => {
//   return Instructor.find().sort({ createdAt: -1 });
// };

//    //GET INSTRUCTOR BY ID
// export const getInstructorByIdService = async (instructorId) => {
//   if (!isValidObjectId(instructorId)) {
//     throw new Error("מזהה מדריך לא תקין");
//   }

//   const instructor = await Instructor.findById(instructorId);

//   if (!instructor) {
//     throw new Error("פרופיל מדריך לא נמצא");
//   }

//   return instructor;
// };

//    //UPDATE INSTRUCTOR
// export const updateInstructorService = async (instructorId, data) => {
//   if (!isValidObjectId(instructorId)) {
//     throw new Error("מזהה מדריך לא תקין");
//   }

//   if (!data || Object.keys(data).length === 0) {
//     throw new Error("לא נשלחו נתונים לעדכון");
//   }

//   // שדות שאסור לעדכן
//   const forbiddenFields = ["_id", "user"];
//   forbiddenFields.forEach((field) => {
//     if (field in data) {
//       delete data[field];
//     }
//   });

//   if (data.phone && !isValidPhone(data.phone)) {
//     throw new Error("מספר הטלפון אינו תקין");
//   }

//   const instructor = await Instructor.findByIdAndUpdate(instructorId, data, {
//     new: true,
//     runValidators: true,
//   });

//   if (!instructor) {
//     throw new Error("מדריך לא נמצא");
//   }

//   return instructor;
// };

//   // DELETE INSTRUCTOR
// export const deleteInstructorService = async (instructorId) => {
//   if (!isValidObjectId(instructorId)) {
//     throw new Error("מזהה מדריך לא תקין");
//   }

//   const instructor = await Instructor.findById(instructorId);
//   if (!instructor) {
//     throw new Error("מדריך לא נמצא");
//   }

//   const courses = await Course.find({ instructor: instructorId });
//   if (courses.length > 0) {
//     instructor.status = "Inactive";
//     await instructor.save();
//     return {
//       message: "מדריך לא נמחק כי יש לו קורסים פעילים, הסטטוס הועבר ל'לא פעיל'",
//     };
//   }

//   await instructor.deleteOne();

//   return { message: "פרופיל המדריך נמחק בהצלחה" };
// };

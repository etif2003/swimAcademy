import mongoose from "mongoose";
import { SchoolInstructor } from "../models/SchoolInstructor.js";
import { School } from "../models/School.js";
import { Instructor } from "../models/Instructor.js";
import { MESSAGES } from "../utils/constants/messages.js";

//helpers 
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

  // CREATE SCHOOL INSTRUCTOR
export const createSchoolInstructorService = async ({
  instructorId,
  schoolId,
  role,
  startDate,
  hoursPerWeek,
}) => {
  if (!isValidObjectId(instructorId) || !isValidObjectId(schoolId)) {
    throw new Error(MESSAGES.SCHOOL_INSTRUCTOR.INVALID_IDS);
  }

  const instructor = await Instructor.findById(instructorId);
  if (!instructor) {
    throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  const school = await School.findById(schoolId);
  if (!school) {
    throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  const existing = await SchoolInstructor.findOne({
    instructor: instructorId,
    school: schoolId,
  });

  if (existing) {
    throw new Error(MESSAGES.SCHOOL_INSTRUCTOR.ALREADY_EXISTS);
  }

  return SchoolInstructor.create({
    instructor: instructorId,
    school: schoolId,
    role,
    startDate,
    hoursPerWeek,
  });
};

   //GET INSTRUCTORS BY SCHOOL
export const getInstructorsBySchoolService = async (schoolId) => {
  if (!isValidObjectId(schoolId)) {
    throw new Error(MESSAGES.SCHOOL.INVALID_ID);
  }

  return SchoolInstructor.find({ school: schoolId, status: "Active" })
    .populate("instructor")
    .sort({ createdAt: -1 });
};

   //GET SCHOOLS BY INSTRUCTOR
export const getSchoolsByInstructorService = async (instructorId) => {
  if (!isValidObjectId(instructorId)) {
    throw new Error(MESSAGES.INSTRUCTOR.INVALID_ID);
  }

  return SchoolInstructor.find({
    instructor: instructorId,
    status: "Active",
  })
    .populate("school")
    .sort({ createdAt: -1 });
};

   //UPDATE SCHOOL INSTRUCTOR
export const updateSchoolInstructorService = async (id, data) => {
  if (!isValidObjectId(id)) {
    throw new Error(MESSAGES.SCHOOL_INSTRUCTOR.INVALID_ID);
  }

  const forbiddenFields = ["_id", "instructor", "school"];
  forbiddenFields.forEach((field) => delete data[field]);

  const record = await SchoolInstructor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    throw new Error(MESSAGES.SCHOOL_INSTRUCTOR.NOT_FOUND);
  }

  return record;
};

  // DELETE SCHOOL INSTRUCTOR
export const deleteSchoolInstructorService = async (id) => {
  if (!isValidObjectId(id)) {
    throw new Error(MESSAGES.SCHOOL_INSTRUCTOR.INVALID_ID);
  }

  const record = await SchoolInstructor.findById(id);
  if (!record) {
    throw new Error(MESSAGES.SCHOOL_INSTRUCTOR.NOT_FOUND);
  }

  record.status = "Inactive";
  await record.save();

  return { message: MESSAGES.SCHOOL_INSTRUCTOR.REMOVED_SUCCESS };
};


// import mongoose from "mongoose";
// import { SchoolInstructor } from "../models/SchoolInstructor.js";
// import { School } from "../models/School.js";
// import { Instructor } from "../models/Instructor.js";

// //helpers 
// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//   // CREATE SCHOOL INSTRUCTOR
// export const createSchoolInstructorService = async ({
//   instructorId,
//   schoolId,
//   role,
//   startDate,
//   hoursPerWeek,
// }) => {
//   if (!isValidObjectId(instructorId) || !isValidObjectId(schoolId)) {
//     throw new Error("מזהה מדריך או בית ספר לא תקין");
//   }

//   const instructor = await Instructor.findById(instructorId);
//   if (!instructor) {
//     throw new Error("מדריך לא נמצא");
//   }

//   const school = await School.findById(schoolId);
//   if (!school) {
//     throw new Error("בית ספר לא נמצא");
//   }

//   const existing = await SchoolInstructor.findOne({
//     instructor: instructorId,
//     school: schoolId,
//   });

//   if (existing) {
//     throw new Error("המדריך כבר משויך לבית הספר");
//   }

//   return SchoolInstructor.create({
//     instructor: instructorId,
//     school: schoolId,
//     role,
//     startDate,
//     hoursPerWeek,
//   });
// };

//    //GET INSTRUCTORS BY SCHOOL
// export const getInstructorsBySchoolService = async (schoolId) => {
//   if (!isValidObjectId(schoolId)) {
//     throw new Error("מזהה בית ספר לא תקין");
//   }

//   return SchoolInstructor.find({ school: schoolId, status: "Active" })
//     .populate("instructor")
//     .sort({ createdAt: -1 });
// };

//    //GET SCHOOLS BY INSTRUCTOR
// export const getSchoolsByInstructorService = async (instructorId) => {
//   if (!isValidObjectId(instructorId)) {
//     throw new Error("מזהה מדריך לא תקין");
//   }

//   return SchoolInstructor.find({
//     instructor: instructorId,
//     status: "Active",
//   })
//     .populate("school")
//     .sort({ createdAt: -1 });
// };

//    //UPDATE SCHOOL INSTRUCTOR
// export const updateSchoolInstructorService = async (id, data) => {
//   if (!isValidObjectId(id)) {
//     throw new Error("מזהה שיוך לא תקין");
//   }

//   const forbiddenFields = ["_id", "instructor", "school"];
//   forbiddenFields.forEach((field) => delete data[field]);

//   const record = await SchoolInstructor.findByIdAndUpdate(id, data, {
//     new: true,
//     runValidators: true,
//   });

//   if (!record) {
//     throw new Error("שיוך לא נמצא");
//   }

//   return record;
// };

//   // DELETE SCHOOL INSTRUCTOR
// export const deleteSchoolInstructorService = async (id) => {
//   if (!isValidObjectId(id)) {
//     throw new Error("מזהה שיוך לא תקין");
//   }

//   const record = await SchoolInstructor.findById(id);
//   if (!record) {
//     throw new Error("שיוך לא נמצא");
//   }

//   record.status = "Inactive";
//   await record.save();

//   return { message: "שיוך המדריך לבית הספר בוטל בהצלחה" };
// };

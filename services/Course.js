import { Course } from "../models/Course.js";
import fs from "fs";

export const getAllCoursesService = async () => {
  return await Course.find({});
};

export const getCourseByIdService = async (id) => {
  return await Course.findOne({ _id: id });
};

export const createCourseService = (body) => {
  return new Course(body);
};

export const saveCourseService = async (newCourse) => {
  return await newCourse.save();
};

export const deleteCourseByIdService = async (id) => {
  return await Course.findByIdAndDelete(id);
};

export const updateCourseByIdService = async (id, updates) => {
  return await Course.findByIdAndUpdate(id, updates, { new: true });
};

export const readCourseFromFileService = async () => {
  return await JSON.parse(
    fs.readFileSync("./courses.json", { encoding: "utf-8" })
  );
};

export const deleteAllCoursesService = async () => {
  return await Course.deleteMany({});
};

export const insertAllCoursesService = async (courses) => {
  return await Course.insertMany(courses);
};

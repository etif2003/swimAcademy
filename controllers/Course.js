import {
  createCourseService,
  deleteAllCoursesService,
  deleteCourseByIdService,
  getAllCoursesService,
  getCourseByIdService,
  insertAllCoursesService,
  readCourseFromFileService,
  saveCourseService,
  updateCourseByIdService,
} from "../services/Course.js";

import { serverResponse } from "../utils/server-response.js";

export const getAllCoursesController = async (req, res) => {
  try {
    const courses = await getAllCoursesService();
    return serverResponse(res, 200, courses);
  } catch (error) {
    return res.status(500).json({
      message: "Error finding courses",
      error: error.message,
    });
  }
};

export const getCourseByIdController = async (req, res) => {
  try {
    const course = await getCourseByIdService(req.params.id);

    if (!course) {
      return serverResponse(res, 404, "Course not found");
    }

    return serverResponse(res, 200, course);
  } catch (error) {
    return res.status(500).json({
      message: "Error finding course",
      error: error.message,
    });
  }
};

export const addCourseController = async (req, res) => {
  try {
    const newCourse = await createCourseService(req.body);
    const savedCourse = await saveCourseService(newCourse);
    return serverResponse(res, 201, savedCourse);
  } catch (error) {
    return res.status(400).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

export const deleteCourseController = async (req, res) => {
  try {
    const courseToDelete = await deleteCourseByIdService(req.params.id);

    if (!courseToDelete) {
      return serverResponse(res, 404, "Course not found");
    }

    return serverResponse(res, 200, courseToDelete);
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting course",
      error: error.message,
    });
  }
};

export const updateCourseController = async (req, res) => {
  try {
    const courseById = await getCourseByIdService(req.params.id);

    if (!courseById) {
      return serverResponse(res, 404, "Course not found");
    }

    const updates = { ...req.body };
    const invalidFields = Object.keys(updates).filter(
      (key) => !(key in courseById)
    );

    if (invalidFields.length > 0) {
      return serverResponse(
        res,
        400,
        `Invalid fields to update: ${invalidFields.join(", ")}`
      );
    }

    const updatedCourse = await updateCourseByIdService(
      req.params.id,
      updates
    );

    return serverResponse(res, 200, updatedCourse);
  } catch (error) {
    return res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

export const resetCoursesController = async (req, res) => {
  try {
    const courses = await readCourseFromFileService();

    await deleteAllCoursesService();
    await insertAllCoursesService(courses);

    return serverResponse(res, 201, courses);
  } catch (error) {
    return res.status(500).json({
      message: "Error resetting courses",
      error: error.message,
    });
  }
};

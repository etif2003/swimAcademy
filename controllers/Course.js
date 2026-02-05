import {
  createCourseService,
  getAllCoursesService,
  getCourseByIdService,
  getCoursesByCreatorService,
  updateCourseService,
  deleteCourseService,
} from "../services/Course.js";

import { serverResponse } from "../utils/server-response.js";

  //CREATE COURSE

export const createCourseController = async (req, res) => {
  try {
    // רק Instructor או School יכולים ליצור קורס
    if (!["Instructor", "School"].includes(req.user.role)) {
      return serverResponse(res, 403, {
        message: "אין הרשאה ליצור קורס",
      });
    }

    const course = await createCourseService({
      ...req.body,
      creatorId: req.user._id,
      creatorType: req.user.role,
    });

    serverResponse(res, 201, course);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};


  //GET ALL COURSES

export const getAllCoursesController = async (req, res) => {
  try {
    const courses = await getAllCoursesService();
    serverResponse(res, 200, courses);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //GET COURSE BY ID

export const getCourseByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await getCourseByIdService(id);

    serverResponse(res, 200, course);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

   //GET COURSES BY CREATOR
export const getCoursesByCreatorController = async (req, res) => {
  try {
    const { creatorId, creatorType } = req.params;

    const courses = await getCoursesByCreatorService({
      creatorId,
      creatorType,
    });

    serverResponse(res, 200, courses);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

//UPDATE COURSE
export const updateCourseController = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCourse = await updateCourseService(
      id,
      req.body,
      req.user
    );

    serverResponse(res, 200, updatedCourse);
  } catch (err) {
    serverResponse(res, 403, { message: err.message });
  }
};


   //DELETE COURSE

export const deleteCourseController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteCourseService(
      id,
      req.user
    );

    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 403, { message: err.message });
  }
};

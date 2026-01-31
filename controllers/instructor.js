import {
  createInstructorService,
  getInstructorByUserService,
  getInstructorByIdService,
  getAllInstructorsService,
  updateInstructorService,
  deleteInstructorService,
} from "../services/instructor.js";

import { serverResponse } from "../utils/server-response.js";

/* =====================
   CREATE INSTRUCTOR PROFILE
===================== */
export const createInstructorController = async (req, res) => {
  try {
    const instructor = await createInstructorService(req.body);
    serverResponse(res, 201, instructor);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

/* =====================
   GET INSTRUCTOR BY USER
===================== */
export const getInstructorByUserController = async (req, res) => {
  try {
    const instructor = await getInstructorByUserService(req.params.userId);
    serverResponse(res, 200, instructor);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

/* =====================
   GET INSTRUCTOR BY ID
===================== */
export const getInstructorByIdController = async (req, res) => {
  try {
    const instructor = await getInstructorByIdService(req.params.id);
    serverResponse(res, 200, instructor);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

/* =====================
   GET ALL INSTRUCTORS
===================== */
export const getAllInstructorsController = async (req, res) => {
  try {
    const instructors = await getAllInstructorsService();
    serverResponse(res, 200, instructors);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

/* =====================
   UPDATE INSTRUCTOR
===================== */
export const updateInstructorController = async (req, res) => {
  try {
    const updatedInstructor = await updateInstructorService(
      req.params.id,
      req.body
    );
    serverResponse(res, 200, updatedInstructor);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

/* =====================
   DELETE INSTRUCTOR
===================== */
export const deleteInstructorController = async (req, res) => {
  try {
    const result = await deleteInstructorService(req.params.id);
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

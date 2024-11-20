import { Router } from "express";
import {
  getAllCoursesByStudentID,
  getCourseByStudentID,
} from "../controllers/courseController.js";

const studentRouter = Router();

studentRouter.get("/:studentID", getCourseByStudentID);
studentRouter.get("/:studentID/all", getAllCoursesByStudentID);

export { studentRouter };
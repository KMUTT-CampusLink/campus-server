import { Router } from "express";
import {
  getAllCoursesByStudentID,
  getCourseByStudentID,
  getCourseHeaderBySectionIDForStudent,
} from "../controllers/courseController.js";

const studentRouter = Router();

studentRouter.get("/:studentID", getCourseByStudentID);
studentRouter.get("/:studentID/all", getAllCoursesByStudentID);
studentRouter.get("/course/:sectionID", getCourseHeaderBySectionIDForStudent);

export { studentRouter };
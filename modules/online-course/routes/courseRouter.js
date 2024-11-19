import { Router } from "express";
import {
  getAllCourses,
  getAllCoursesByProfessorID,
  getAllCoursesByStudentID,
  getCourseByStudentID,
  getCourseHeaderBySectionID,
} from "../controllers/courseController.js";
const courseRouter = Router();

// create routes here
courseRouter.get("/", (req, res) => {
  return res.send("Online Course");
});

courseRouter.get("/all", getAllCourses);
courseRouter.get("/:studentID", getCourseByStudentID);
courseRouter.get("/:studentID/all", getAllCoursesByStudentID);
courseRouter.get("/:professorID/teach", getAllCoursesByProfessorID);
courseRouter.get("/course/:sectionID", getCourseHeaderBySectionID);

export { courseRouter };
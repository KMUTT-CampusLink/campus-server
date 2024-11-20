import { Router } from "express";
import {
  getAllCourses,
  getCourseHeaderBySectionID,
  getAllCoursesByProfessorID,
} from "../controllers/courseController.js";

import { studentRouter } from "./studentRouter.js";
import { discussionRouter } from "./discussionRouter.js";
// import { professorRouter } from "./professorRouter.js";

const courseRouter = Router();

// create routes here
courseRouter.get("/", (req, res) => {
  return res.send("Online Course");
});

courseRouter.get("/all", getAllCourses);
courseRouter.get("/:sectionID", getCourseHeaderBySectionID);
courseRouter.use("/student", studentRouter);
courseRouter.get("/:professorID/teach", getAllCoursesByProfessorID);
courseRouter.get("/course/:sectionID", getCourseHeaderBySectionID);

export { courseRouter };
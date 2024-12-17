import { Router } from "express";
import { getAllCourses, getCourseByStudentID } from "../controllers/courseController.js";
const courseRouter = Router();

// create routes here
courseRouter.get("/", (req, res) => {
  return res.send("Online Course");
});

courseRouter.get("/all", getAllCourses);
courseRouter.get("/:studentID", getCourseByStudentID);

export { courseRouter };

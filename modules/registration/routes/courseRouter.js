import { Router } from "express";
import {
  getCourseByCode,
  getAllCourses,
  getSectionByCode,
  searchCourses,
  getActiveCoursesByStudentId,
} from "../controllers/courseController.js";
const courseRouter = Router();

courseRouter.get("/", (req, res) => {
  return res.send("Course");
});

courseRouter.get("/search", searchCourses);
courseRouter.get("/all", getAllCourses);
courseRouter.get("/:code/section", getSectionByCode);
courseRouter.get("/:code", getCourseByCode);
courseRouter.get("/:studentId/active", getActiveCoursesByStudentId);

export { courseRouter };

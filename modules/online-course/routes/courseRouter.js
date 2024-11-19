import { Router } from "express";
import {
  addVideo,
  getAllVideos,
} from "../controllers/courseMaterialController.js";
import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import file_uploader from "../../../core/middleware/multerUploader.js";
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
courseRouter.get("/videos", getAllVideos);
courseRouter.get("/:studentID", getCourseByStudentID);
courseRouter.get("/:studentID/all", getAllCoursesByStudentID);
courseRouter.get("/:professorID/teach", getAllCoursesByProfessorID);
courseRouter.get("/course/:sectionID", getCourseHeaderBySectionID);
courseRouter.post(
  "/addVideo",
  file_uploader.single("courseVideo"),
  multerErrorHandler,
  addVideo
);

export { courseRouter };

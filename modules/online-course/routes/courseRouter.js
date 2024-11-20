import { Router } from "express";
import {
  addVideo,
  getAllVideos,
} from "../controllers/courseMaterialController.js";
import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import file_uploader from "../../../core/middleware/multerUploader.js";
import {
  getAllCourses,
  getCourseHeaderBySectionID,
  getAllCoursesByProfessorID,
} from "../controllers/courseController.js";

import { studentRouter } from "./studentRouter.js";
import { discussionRouter } from "./discussionRouter.js";

const courseRouter = Router();

// create routes here
courseRouter.get("/", (req, res) => {
  return res.send("Online Course");
});

courseRouter.get("/all", getAllCourses);
courseRouter.get("/videos", getAllVideos);
courseRouter.get("/:sectionID", getCourseHeaderBySectionID);
courseRouter.get("/:professorID/teach", getAllCoursesByProfessorID);

courseRouter.use("/student", studentRouter);
courseRouter.use("/discussion", discussionRouter);

courseRouter.post(
  "/addVideo",
  file_uploader.single("courseVideo"),
  multerErrorHandler,
  addVideo
);

export { courseRouter };

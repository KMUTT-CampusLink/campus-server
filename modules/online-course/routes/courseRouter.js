import { Router } from "express";
import {
  addCourseMaterials,
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
import { assignmentRouter } from "./assignmentRouter.js";
// import { professorRouter } from "./professorRouter.js";

const courseRouter = Router();

// create routes here
courseRouter.get("/", (req, res) => {
  return res.send("Online Course");
});

courseRouter.get("/all", getAllCourses);
courseRouter.get("/videos/:section_id", getAllVideos);
courseRouter.get("/:sectionID", getCourseHeaderBySectionID);
courseRouter.use("/student", studentRouter);
courseRouter.use("/discussion", discussionRouter);
courseRouter.use("/assignment", assignmentRouter);
// courseRouter.use("/:studentID/all",getAllCoursesByStudentID);
courseRouter.get("/:professorID/teach", getAllCoursesByProfessorID);
courseRouter.get("/course/:sectionID", getCourseHeaderBySectionID);

courseRouter.post(
  "/addVideo",
  file_uploader.single("courseVideo"),
  multerErrorHandler,
  addVideo
);

courseRouter.post(
  "/addVideoMaterials",
  file_uploader.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "materialFiles", maxCount: 10 },
  ]),
  multerErrorHandler,
  addCourseMaterials
);

export { courseRouter };

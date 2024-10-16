import { Router } from "express";
import {
  addEnrollmentDetail,
  deleteEnrollmentDetail,
  getSemesterByStudentId,
} from "../controllers/enrollmentController.js";
const enrollmentRouter = Router();

enrollmentRouter.get("/", (req, res) => {
  return res.send("Enroll");
});
enrollmentRouter.get("/semesters/:studentId", getSemesterByStudentId);
enrollmentRouter.post("/", addEnrollmentDetail);
enrollmentRouter.delete("/:selectedEnrollmentId", deleteEnrollmentDetail);

export { enrollmentRouter };

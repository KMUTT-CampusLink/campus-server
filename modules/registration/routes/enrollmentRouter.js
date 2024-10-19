import { Router } from "express";
import {
  addEnrollmentDetail,
  deleteEnrollmentDetail,
  getSemesterByStudentId,
  getOrCreateEnrollmentHead,
  getPaymentStatus,
} from "../controllers/enrollmentController.js";
const enrollmentRouter = Router();

enrollmentRouter.get("/", (req, res) => {
  return res.send("Enroll");
});
enrollmentRouter.get("/payment/:headId", getPaymentStatus);
enrollmentRouter.get("/semesters/:studentId", getSemesterByStudentId);
enrollmentRouter.post("/head", getOrCreateEnrollmentHead);
enrollmentRouter.post("/", addEnrollmentDetail);
enrollmentRouter.delete("/:selectedEnrollmentId", deleteEnrollmentDetail);

export { enrollmentRouter };

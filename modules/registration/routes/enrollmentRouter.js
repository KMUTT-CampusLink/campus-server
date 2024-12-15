import { Router } from "express";
import {
  addEnrollmentDetail,
  deleteEnrollmentDetail,
  getOrCreateEnrollmentHead,
  getPaymentStatus,
  withdrawEnrollmentDetail,
} from "../controllers/enrollmentController.js";
const enrollmentRouter = Router();

enrollmentRouter.get("/", (req, res) => {
  return res.send("Enroll");
});
enrollmentRouter.get("/payment/:headId", getPaymentStatus);
enrollmentRouter.post("/head", getOrCreateEnrollmentHead);
enrollmentRouter.post("/", addEnrollmentDetail);
enrollmentRouter.post("/:selectedEnrollmentId", withdrawEnrollmentDetail);
enrollmentRouter.delete("/:selectedEnrollmentId", deleteEnrollmentDetail);

export { enrollmentRouter };

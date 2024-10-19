import { Router } from "express";
import {
  getTranscriptByStudentId,
  getTranscriptBySemesterId,
} from "../controllers/transcriptController.js";
const transcriptRouter = Router();

transcriptRouter.get("/", (req, res) => {
  return res.send("Transcript");
});
transcriptRouter.get("/:studentId", getTranscriptByStudentId);
transcriptRouter.get("/:studentId/:semesterId", getTranscriptBySemesterId);

export { transcriptRouter };

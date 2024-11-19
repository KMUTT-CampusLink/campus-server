import { Router } from "express";

import validateRoles from "../middleware/validateRoles.js";

// professor import
import createExam from "../controllers/professor/examModification/createExam.js";
import getExamById from "../controllers/professor/examModification/getExamById.js";
import getExams from "../controllers/professor/examModification/getExams.js";
import getExamDataById from "../controllers/professor/examModification/getExamDataById.js";
import deleteExamById from "../controllers/professor/examModification/deleteExamById.js";
import updateExam from "../controllers/professor/examModification/updateExam.js";
import updateExamSettings from "../controllers/professor/examModification/updateExamSettings.js";
import getFullMark from "../controllers/professor/examModification/getFullMark.js";
import getExamParticipants from "../controllers/professor/studentScoring/getParticipants.js";
import getStudentScore from "../controllers/professor/studentScoring/getStudentScore.js";
import getStudentAnswerById from "../controllers/professor/studentScoring/getStudentAnswerById.js";
import getStudentData from "../controllers/professor/studentScoring/getStudentData.js";
import getQuestionScore from "../controllers/professor/studentScoring/getQuestionScore.js";
import getStudentScoreById from "../controllers/professor/studentScoring/getStudentScoreById.js";
import updateStudentScore from "../controllers/professor/studentScoring/updateStudentScore.js";
import updateExamAnnouncement from "../controllers/professor/examModification/updateExamAnnoucement.js";
import dashboard from "../controllers/professor/studentScoring/dashboard.js";
import getAllStudentInSection from "../controllers/professor/examModification/getAllStudentInSection.js";
// student import
import getAllExam from "../controllers/student/getAllExam.js";
import getHistoryExams from "../controllers/student/getHistoryExam.js";
import studentGetExamDataById from "../controllers/student/studentGetExamDataById.js";
import verifyPassword from "../controllers/student/verifyPassword.js";
import submitExam from "../controllers/student/submitExam.js";
import toggleExamStatus from "../controllers/student/toggleExamStatus.js";
import getExamTitle from "../controllers/student/getExamTitle.js";
import getInprogressExam from "../controllers/student/getInprogressExam.js";
import getStudentAnswer from "../controllers/student/getStudentAnswer.js";
import toggleAnswer from "../controllers/student/toggleAnswer.js";
import getStudentReview from "../controllers/student/getStudentReview.js";
import getStudentExamStatus from "../controllers/student/getStudentExamStatus.js";
import getExamTime from "../controllers/student/getExamTime.js";

const examRouter = Router();

examRouter.get("/", (req, res) => {
  return res.send("Online Exam");
});

examRouter.get("/validateRoles", validateRoles);

//professor router
examRouter.post("/professor/createExam", createExam);
examRouter.get("/professor/getExams", getExams);
examRouter.get("/professor/getExamById", getExamById);
examRouter.delete("/professor/deleteExamById", deleteExamById);
examRouter.get("/professor/getExamDataById", getExamDataById);
examRouter.get("/professor/getDashboardData", dashboard);
examRouter.put("/professor/updateExam", updateExam);
examRouter.get("/professor/getFullMark", getFullMark);
examRouter.put("/professor/updateExamSettings", updateExamSettings);
examRouter.get("/professor/getExamParticipants", getExamParticipants);
examRouter.get("/professor/getStudentScore", getStudentScore);
examRouter.get("/professor/getStudentAnswers", getStudentAnswerById);
examRouter.get("/professor/getStudentData", getStudentData);
examRouter.get("/professor/getQuestionScore", getQuestionScore);
examRouter.get("/professor/getStudentScoreById", getStudentScoreById);
examRouter.put("/professor/updateStudentScore", updateStudentScore);
examRouter.put("/professor/updateExamAnnouncement", updateExamAnnouncement);
examRouter.get("/professor/getAllStudentInSection", getAllStudentInSection);
//student router
examRouter.get("/student/getAllExam", getAllExam);
examRouter.get("/student/getHistoryExams", getHistoryExams);
examRouter.post("/student/verifyPassword", verifyPassword);
examRouter.get("/student/getExamDataById", studentGetExamDataById);
examRouter.post("/student/submitExam", submitExam);
examRouter.put("/student/toggleExamStatus", toggleExamStatus);
examRouter.get("/student/getExamTitle", getExamTitle);
examRouter.get("/student/getInprogressExam", getInprogressExam);
examRouter.get("/student/getStudentAnswer", getStudentAnswer);
examRouter.put("/student/toggleAnswer", toggleAnswer);
examRouter.get("/student/getStudentReview", getStudentReview);
examRouter.get("/student/getStudentStatus", getStudentExamStatus);
examRouter.get("/student/getExamTime", getExamTime);

export { examRouter };

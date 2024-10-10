import { Router } from "express";

// professor import
import createExam from "../controllers/professor/examModification/createExam.js";
import editExam from "../controllers/professor/examModification/editExam.js";
import getExamById from "../controllers/professor/examModification/getExamById.js";
import getExams from "../controllers/professor/examModification/getExams.js";
import deleteExamById from "../controllers/professor/examModification/deleteExamById.js";
import updateExamSettings from "../controllers/professor/examModification/updateExamSettings.js";

import announceScore from "../controllers/professor/studentScoring/announceScore.js";
import dashboard from "../controllers/professor/studentScoring/dashboard.js";
import examScoring from "../controllers/professor/studentScoring/examScoring.js";
import finishScoringById from "../controllers/professor/studentScoring/finishScoringById.js";
import getStudentScore from "../controllers/professor/studentScoring/getStudentScore.js";

// student import
import getAllExamQuestionById from "../controllers/student/getAllExamQuestionById.js";
import studentGetExamById from "../controllers/student/studentGetExamById.js";
import verifyExamPassword from "../controllers/student/verifyExamPassword.js";

const examRouter = Router();

examRouter.get("/", (req, res) => {
  return res.send("Online Exam");
});

export { examRouter };

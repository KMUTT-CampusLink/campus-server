import { Router } from "express";

// professor import
import createExam from "../controllers/professor/examModification/createExam";
import editExam from "../controllers/professor/examModification/editExam";
import getExamById from "../controllers/professor/examModification/getExamById";
import getExams from "../controllers/professor/examModification/getExams";
import deleteExamById from "../controllers/professor/examModification/deleteExamById";
import updateExamSettings from "../controllers/professor/examModification/updateExamSettings";

import announceScore from "../controllers/professor/studentScoring/announceScore";
import dashboard from "../controllers/professor/studentScoring/dashboard";
import examScoring from "../controllers/professor/studentScoring/examScoring";
import finishScoringById from "../controllers/professor/studentScoring/finishScoringById";
import getStudentScore from "../controllers/professor/studentScoring/getStudentScore";

// student import
import getAllExamQuestionById from "../controllers/student/getAllExamQuestionById";
import studentGetExamById from "../controllers/student/studentGetExamById";
import verifyExamPassword from "../controllers/student/verifyExamPassword";

const examRouter = Router();

examRouter.get("/", (req, res) => {
  return res.send("Online Exam");
});

export { examRouter };

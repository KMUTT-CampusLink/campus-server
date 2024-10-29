import { Router } from "express";

// professor import
import createExam from "../controllers/professor/examModification/createExam.js";
import editExam from "../controllers/professor/examModification/editExam.js";
import getExamById from "../controllers/professor/examModification/getExamById.js";
import getExams from "../controllers/professor/examModification/getExams.js";
import getExamDataById from "../controllers/professor/examModification/getExamDataById.js";
import deleteExamById from "../controllers/professor/examModification/deleteExamById.js";
import updateExamSettings from "../controllers/professor/examModification/updateExamSettings.js";
import getFullMark from "../controllers/professor/examModification/getFullMark.js";


import announceScore from "../controllers/professor/studentScoring/announceScore.js";
import dashboard from "../controllers/professor/studentScoring/dashboard.js";
import examScoring from "../controllers/professor/studentScoring/examScoring.js";
import finishScoringById from "../controllers/professor/studentScoring/finishScoringById.js";
import getStudentScore from "../controllers/professor/studentScoring/getStudentScore.js";

// student import
import getAllExamQuestionById from "../controllers/student/getAllExamQuestionById.js";
import studentGetExamById from "../controllers/student/studentGetExamById.js";
import getAllExam from "../controllers/student/getAllExam.js";
import getHistoryExams from "../controllers/student/getHistoryExam.js";
import verifyPassword from "../controllers/student/verifyPassword.js";

const examRouter = Router();

examRouter.get("/", (req, res) => {
  return res.send("Online Exam");
});

//professor router
examRouter.post("/professor/createExam", createExam);
examRouter.get("/professor/getExams", getExams);
examRouter.get("/professor/getExamById", getExamById);
examRouter.delete("/professor/deleteExamById", deleteExamById);
examRouter.get("/professor/getExamDataById",getExamDataById)
examRouter.get("/professor/getFullMark", getFullMark);
examRouter.put("/professor/updateExamSettings", updateExamSettings);
//student rotuer
examRouter.get("/student/getAllExam", getAllExam);
examRouter.get("/student/getHistoryExams", getHistoryExams);
examRouter.post("/student/verifyPassword",verifyPassword);

export { examRouter };

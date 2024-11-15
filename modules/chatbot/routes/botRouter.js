import { Router } from "express";
// import your logics from controllers here
import { faqController } from "../controllers/faqController.js";
import { receiveMessageController } from "../controllers/receiveMessageController.js";
import { clubListController } from "../controllers/webhookReq/clubs/clubListController.js";
import { checkBookController } from "../controllers/webhookReq/library/checkBookController.js";
import { professorController } from "../controllers/webhookReq/programs/professorController.js";
import { programsListController } from "../controllers/webhookReq/programs/programsListController.js";
import { requirecourseController } from "../controllers/webhookReq/programs/requiredCourseController.js";
import { tutionFeeController } from "../controllers/webhookReq/programs/tutionFeeController.js";
import { examScoreController } from "../controllers/webhookReq/student/examScoreController.js";
import { futureExamController } from "../controllers/webhookReq/student/futureExamController.js";
import { semesterEndController } from "../controllers/webhookReq/timeTables/semesterEndController.js";
import { webhookReqController } from "../controllers/webhookReqController.js";
import { semesterStartController } from "../controllers/webhookReq/timeTables/semesterStartController.js";

const botRouter = Router();

botRouter.post("/webhook", webhookReqController);

botRouter.get("/semesterStartDate", semesterStartController);
botRouter.get("/semesterEndDate", semesterEndController);
botRouter.get("/professorname", professorController);
botRouter.post("/message", receiveMessageController);
botRouter.get("/faqs", faqController);
botRouter.get("/clublist",clubListController);
botRouter.get("/tutionfee",tutionFeeController);
botRouter.get("/programlist",programsListController);
botRouter.get("/requiredcourse",requirecourseController);
botRouter.get("/checkbook",checkBookController);
botRouter.get("/examscore",examScoreController);
botRouter.get("/future",futureExamController);

export { botRouter };

// ngrok http --url=epic-witty-kit.ngrok-free.app 3000
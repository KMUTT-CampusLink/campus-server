import { Router } from "express";
// import your logics from controllers here
import { faqController } from "../controllers/faqController.js";
import { webhookReqController } from "../controllers/webhookReqController.js";
import { receiveMessageController } from "../controllers/receiveMessageController.js";
import { programsListController } from "../controllers/webhookReq/programs/programsListController.js";
import { clubListController } from "../controllers/webhookReq/clubs/clubListController.js";
import { tutionFeeController } from "../controllers/webhookReq/programs/tutionFeeController.js";
import { requirecourseController } from "../controllers/webhookReq/programs/requiredCourseController.js";
import { checkBookController } from "../controllers/webhookReq/library/checkBookController.js";
import { examScoreController } from "../controllers/webhookReq/student/examScoreController.js";
import { futureExamController } from "../controllers/webhookReq/student/futureExamController.js";
import { buildingContactController } from "../controllers/webhookReq/building and secruity/buildingContactController.js";
import { clubAnnouncementController } from "../controllers/webhookReq/clubs/clubAnnouncementController.js";
import { allaboutClubController } from "../controllers/webhookReq/clubs/allaboutClubController.js";
import { allaboutCourseController } from "../controllers/webhookReq/programs/allaboutCourseController.js";
import { courseDurationController } from "../controllers/webhookReq/programs/courseDurationController.js";

const botRouter = Router();

botRouter.post("/webhook", webhookReqController);

botRouter.post("/message", receiveMessageController);
botRouter.get("/faqs", faqController);
botRouter.get("/clublist",clubListController);
botRouter.get("/tutionfee",tutionFeeController);
botRouter.get("/programlist",programsListController);
botRouter.get("/requiredcourse",requirecourseController);
botRouter.get("/duration",courseDurationController);
botRouter.get("/checkbook",checkBookController);
botRouter.get("/examscore",examScoreController);
botRouter.get("/future",futureExamController);
botRouter.get("/contact",buildingContactController);
botRouter.get("/clubannouncement",clubAnnouncementController);
botRouter.get("/clubinfo",allaboutClubController);
botRouter.get("/courseinfo",allaboutCourseController);

export { botRouter };

// ngrok http --url=epic-witty-kit.ngrok-free.app 3000
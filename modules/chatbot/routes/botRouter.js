import { Router } from "express";
// import your logics from controllers here
import { faqController } from "../controllers/faqController.js";
import { webhookReqController } from "../controllers/webhookReqController.js";
import { receiveMessageController } from "../controllers/receiveMessageController.js";
import { programsListController } from "../controllers/webhookReq/programs/programsListController.js";
import { clubListController } from "../controllers/webhookReq/clubs/clubListController.js";
import { tutionFeeController } from "../controllers/webhookReq/programs/tutionFeeController.js";
import { requirecourseController } from "../controllers/webhookReq/programs/requiredCourseController.js";

const botRouter = Router();

botRouter.post("/webhook", webhookReqController);

botRouter.post("/message", receiveMessageController);
botRouter.get("/faqs", faqController);
botRouter.get("/clublist",clubListController);
botRouter.get("/tutionfee",tutionFeeController);
botRouter.get("/programlist",programsListController);
botRouter.get("/requiredcourse",requirecourseController);

export { botRouter };

// ngrok http --url=epic-witty-kit.ngrok-free.app 3000
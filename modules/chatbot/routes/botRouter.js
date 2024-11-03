import { application, Router } from "express";

// import your logics from controllers here
import { faqController } from "../controllers/faqController.js";
import { webhookReqController } from "../controllers/webhookReqController.js";
import { receiveMessageController } from "../controllers/receiveMessageController.js";
import { semesterStartController } from "../controllers/webhookReq/programs/semesterStartController.js";
import { tutionFeeController } from "../controllers/webhookReq/programs/tutionFeeController.js";
import { semesterEndController } from "../controllers/webhookReq/programs/semesterEndController.js";
import { clubListController } from "../controllers/webhookReq/clubs/clubListController.js";
import { clubMemberController } from "../controllers/webhookReq/clubs/clubMemberController.js";
import { libraryEventController } from "../controllers/webhookReq/library/libraryEventController.js";
import { requirecourseController } from "../controllers/webhookReq/programs/requiredCourseController.js";

const botRouter = Router();

botRouter.post("/webhook", webhookReqController);

botRouter.post("/message", receiveMessageController);
botRouter.get("/faqs", faqController);
botRouter.get("/start",semesterStartController);
botRouter.get("/end",semesterEndController);
botRouter.get("/clubslist",clubListController);
botRouter.get("/clubmember",clubMemberController);
botRouter.get("/tuitionfee",tutionFeeController);
botRouter.get("/libraryevent",libraryEventController);
botRouter.get("/requiredcourse",requirecourseController);



export { botRouter };

// ngrok http --url=epic-witty-kit.ngrok-free.app 3000
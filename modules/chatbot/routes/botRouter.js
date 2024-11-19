import { Router } from "express";
// import your logics from controllers here
import { faqController } from "../controllers/faqController.js";
import { receiveMessageController } from "../controllers/receiveMessageController.js";
import { webhookReqController } from "../controllers/webhookReqController.js";

const botRouter = Router();

botRouter.post("/webhook", webhookReqController);

botRouter.post("/message", receiveMessageController);
botRouter.get("/faqs", faqController);

export { botRouter };

// ngrok http --url=epic-witty-kit.ngrok-free.app 3000
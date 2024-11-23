import { Router } from "express";
// import your logics from controllers here
import { faqController } from "../controllers/faqController.js";
import { receiveMessageController } from "../controllers/receiveMessageController.js";
import { webhookReqController } from "../controllers/webhookReqController.js";
import { availableParkingSlotController } from '../controllers/webhookReq/parking/availableParkingSlot.js'
import { unPaidInvoicesController } from "../controllers/webhookReq/Invoices/UnPaidInvoicesController.js";
import { professorContactController } from "../controllers/webhookReq/programs/professorContactController.js";

const botRouter = Router();

botRouter.post("/webhook", webhookReqController);

botRouter.get("/professorContact", professorContactController);
botRouter.get("/unpaidInvoices", unPaidInvoicesController);
botRouter.get("/availableParkingSlots", availableParkingSlotController);
botRouter.post("/message", receiveMessageController);
botRouter.get("/faqs", faqController);

export { botRouter };

// ngrok http --url=epic-witty-kit.ngrok-free.app 3000

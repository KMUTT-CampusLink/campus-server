import { Router } from "express";
import getSetting from "../controllers/professor/getSetting.js";
import updateSetting from "../controllers/professor/updateSetting.js";
import getRecordCode from "../controllers/professor/getRecordCode.js";

const devAttendRouter = Router();

devAttendRouter
  .get("/setting/:section_id", getSetting)
  .post("/setting/:attend_id", updateSetting);
devAttendRouter.get("/record/:section_id", getRecordCode);

export { devAttendRouter };

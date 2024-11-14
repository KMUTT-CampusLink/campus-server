import { Router } from "express";
import getSetting from "../controllers/professor/getSetting.js";
import updateSetting from "../controllers/professor/updateSetting.js";

const devAttendRouter = Router();

devAttendRouter
  .get("/setting/:section_id", getSetting)
  .post("/setting/:attend_id", updateSetting);

export { devAttendRouter };

import { Router } from "express";
import {
  getGPAXByStudentId,
  getGPAXBySemesterId,
} from "../controllers/gpaxController.js";
const gpaxRouter = Router();

gpaxRouter.get("/", (req, res) => {
  return res.send("GPAX");
});
gpaxRouter.get("/:studentId", getGPAXByStudentId);
gpaxRouter.get("/:studentId/:semesterId", getGPAXBySemesterId);

export { gpaxRouter };

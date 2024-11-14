import { Router } from "express";
import { studentRouter } from "./studentRouter.js";
import { courseRouter } from "./courseRouter.js";
import { enrollmentRouter } from "./enrollmentRouter.js";
import { transcriptRouter } from "./transcriptRouter.js";
import { gpaxRouter } from "./gpaxRouter.js";
import { semesterRouter } from "./semesterRouter.js";
const regisRouter = Router();

regisRouter.get("/", (req, res) => {
  return res.send("Registration");
});
regisRouter.use("/student", studentRouter);
regisRouter.use("/course", courseRouter);
regisRouter.use("/enroll", enrollmentRouter);
regisRouter.use("/transcript", transcriptRouter);
regisRouter.use("/gpax", gpaxRouter);
regisRouter.use("/semesters", semesterRouter);

export { regisRouter };

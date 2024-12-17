import { Router } from "express";
import { getAllSemesters, getPeriodBySemesterId, getSemesterByStudentId } from "../controllers/semesterController.js";
const semesterRouter = Router();

semesterRouter.get("/", (req, res) => {
    return res.send("Semesters");
});
semesterRouter.get("/period/:semesterId", getPeriodBySemesterId);
semesterRouter.get("/all", getAllSemesters);
semesterRouter.get("/:studentId", getSemesterByStudentId);

export { semesterRouter };

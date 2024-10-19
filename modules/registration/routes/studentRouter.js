import { Router } from "express";
import studentController from "../controllers/studentController.js";
const studentRouter = Router();

studentRouter.get("/", (req, res) => {
  return res.send("Student");
});
studentRouter.get("/:studentId", studentController);

export { studentRouter };

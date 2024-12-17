import { Router } from "express";
import { studentInfoController, studentProfileController } from "../controllers/studentController.js";
const studentRouter = Router();

studentRouter.get("/", (req, res) => {
  return res.send("Student");
});
studentRouter.get("/:studentId", studentInfoController);
studentRouter.get("/:studentId/profile", studentProfileController);

export { studentRouter };

import { Router } from "express";
import { createAssignment, deleteAssignment, editAssignment, getAllAssignments } from "../controllers/assignmentController.js";

const assignmentRouter = Router();

assignmentRouter.post("/create", createAssignment);
assignmentRouter.put("/:assignmentID/edit", editAssignment);
assignmentRouter.delete("/:assignmentID/delete", deleteAssignment);
assignmentRouter.get("/:section_id/all",getAllAssignments);

export { assignmentRouter };

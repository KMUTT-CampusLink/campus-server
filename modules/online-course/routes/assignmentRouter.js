import { Router } from "express";
import { createAssignment, deleteAssignment, editAssignment, getAllAssignments } from "../controllers/assignmentController.js";
import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import file_uploader from "../../../core/middleware/multerUploader.js";
import { addAssignmentFile } from "../controllers/assignmentController2";

const assignmentRouter = Router();

assignmentRouter.post("/create", createAssignment);
assignmentRouter.put("/:assignmentID/edit", editAssignment);
assignmentRouter.delete("/:assignmentID/delete", deleteAssignment);
assignmentRouter.get("/:section_id/all", getAllAssignments);

// Route for file upload (addFile)
assignmentRouter.post(
    "/upload",
    file_uploader.single("description"), // Middleware to handle single file upload
    multerErrorHandler, // Middleware to handle upload errors
    addAssignmentFile // Controller to handle file upload and database record creation
);


export { assignmentRouter };



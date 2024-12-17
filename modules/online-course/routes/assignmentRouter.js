import { Router } from "express";
import { addAssignmentFile, addSubmissionStudent, deleteAssignment, editAssignment, editSubmissionStudent, getAllAssignments,getAllStudentSubmission } from "../controllers/assignmentController.js";
import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import file_uploader from "../../../core/middleware/multerUploader.js";

const assignmentRouter = Router();

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

// Route to upload student submission
assignmentRouter.post(
    "/assignmentSubmission",
    file_uploader.single("file_path"), // Middleware to handle single file upload
    multerErrorHandler, // Middleware to handle upload errors
    addSubmissionStudent // Controller to handle file upload and database record creation
);

// Route to edit student submission
assignmentRouter.put(
    "/:assignmentSubmissionID/submit/edit",
    file_uploader.single("file_path"), // Middleware for handling the file upload
    editSubmissionStudent
);

assignmentRouter.get("/studentSubmission/:sectionID/:assignmentID", getAllStudentSubmission);


export { assignmentRouter };



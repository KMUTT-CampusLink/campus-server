import prisma from "../../../core/db/prismaInstance.js";
import minioClient from "../../../core/config/minioConfig.js";
// Controller to create an assignment

export const addAssignmentFile = async (req, res) => {
  const { section_id, title, start_date, end_date } = req.body;

  try {
    // Validate required fields
    if (!section_id || !title) {
      return res.status(400).json({ message: "Section ID and title are required." });
    }

    // Extract the uploaded file
    const file = req.file; // Assuming you're using a middleware like multer for file uploads
    if (!file) {
      return res.status(400).json({ message: "File is required." });
    }

    // Prepare file data
    const fileData = {
      objName: file.objName, // Path or identifier of the file in MinIO
      originalName: file.originalname, // Original name of the uploaded file
    };
    console.log("Uploaded file:", fileData);

    // Create a new record in the database
    const newFileRecord = await prisma.assignment.create({
      data: {
        section_id: parseInt(section_id),
        title,
        description: fileData.objName, // Save the file path in the description column
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    console.log("New File Record Created:", newFileRecord);

    return res.status(200).json({
      message: "File uploaded successfully!",
      file: fileData,
      fileRecord: newFileRecord,
    });
  } catch (error) {
    console.log("Error uploading file:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addAssignment = async (req, res) => {
  const { title, sec_id } = req.body;
  console.log(title);
  console.log(sec_id);

  try {
    console.log(req.file.objName);
    // const newVideo = await prisma.course_video.create({
    //   data: {
    //     title: title,
    //     section_id: parseInt(sec_id),
    //     video_url: req.file.objName,
    //   },
    // });

    // console.log(newVideo);
    return res.status(200).json({ "newVideo": "newVideo" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};


// Controller to edit an assignment
export const editAssignment = async (req, res) => {
  try {
    // Extract assignment ID from the request parameters
    const { assignmentID } = req.params;

    // Extract updated data from the request body
    const { title, description, start_date, end_date } = req.body;

    // Validate the ID
    if (!assignmentID) {
      return res.status(400).json({
        error: 'Assignment ID is required.',
      });
    }

    // Validate if the assignment exists
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentID) },
    });

    if (!existingAssignment) {
      return res.status(404).json({
        error: 'Assignment not found.',
      });
    }

    // Update the assignment with new details
    const updatedAssignment = await prisma.assignment.update({
      where: { id: parseInt(assignmentID) },
      data: {
        title: title || existingAssignment.title,
        description: description || existingAssignment.description,
        start_date: start_date ? new Date(start_date) : existingAssignment.start_date,
        end_date: end_date ? new Date(end_date) : existingAssignment.end_date,
        updated_at: new Date(), // Automatically update the `updated_at` timestamp
      },
    });

    // Return the updated assignment
    return res.status(200).json({
      message: 'Assignment updated successfully!',
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error('Error editing assignment:', error);
    return res.status(500).json({
      error: 'An error occurred while editing the assignment.',
    });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    // Extract assignment ID from the request parameters
    const { assignmentID } = req.params;

    // Validate the ID
    if (!assignmentID) {
      return res.status(400).json({
        error: 'Assignment ID is required.',
      });
    }

    // Check if the assignment exists
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentID) },
    });

    if (!existingAssignment) {
      return res.status(404).json({
        error: 'Assignment not found.',
      });
    }

    // Delete the assignment
    await prisma.assignment.delete({
      where: { id: parseInt(assignmentID) },
    });

    // Return success response
    return res.status(200).json({
      message: 'Assignment deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return res.status(500).json({
      error: 'An error occurred while deleting the assignment.',
    });
  }
};

// Controller to get all assignments
export const getAllAssignments = async (req, res) => {
  try {
    // Extract optional `section_id` from the request query
    const { section_id } = req.params;

    // Define filter condition
    const filter = section_id
      ? { where: { section_id: parseInt(section_id) } }
      : {};

    // Fetch all assignments from the database
    const assignments = await prisma.assignment.findMany({
      ...filter,
      // Optional: order by creation date
    });

    // Return the list of assignments
    return res.status(200).json({
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({
      error: "An error occurred while retrieving assignments.",
    });
  }
};

// Controller to add a submission for an assignment
export const addSubmissionStudent = async (req, res) => {

  const { assignment_id, student_id } = req.body;

  try {
    // Validate required fields
    if (!assignment_id || !student_id) {
      return res.status(400).json({ message: "Assignment ID and student ID are required." });
    }

    // Convert values to the correct types
    const assignmentId = parseInt(assignment_id, 10);
    const studentId = student_id.toString(); // Assuming student_id is expected to be a string

    if (isNaN(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID format." });
    }

    // Extract the uploaded file
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File is required." });
    }

    const filePath = file.objName || file.path; // Use file path if objName is undefined

if (!filePath) {
  return res.status(400).json({ message: "File path is missing." });
}


    // Prepare file data
    const fileData = {
      objName: file.objName, // Path or identifier of the file in MinIO
      originalName: file.originalname, // Original name of the uploaded file
    };
    console.log("Uploaded file:", fileData);

    // Create a new record in the database
    const newFileRecord = await prisma.assignment_submission.create({
      data: {
        assignment_id: assignmentId,
        student_id: studentId,
        file_path: fileData.objName,
      },
    });

    console.log("New File Record Created:", newFileRecord);

    return res.status(200).json({
      message: "File uploaded successfully!",
      file: fileData,
      fileRecord: newFileRecord,
    });
  } catch (error) {
    console.log("Error uploading file:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// COntroller to edit a assignemnt submission file
export const editSubmissionStudent = async (req, res) => {
  const { assignmentSubmissionID } = req.params; // Corrected parameter name
  const { student_id } = req.body; // Assuming student_id is passed in the request body

  console.log("Assignment ID:", assignmentSubmissionID);
  console.log("Student ID:", student_id);

  try {
    // Validate required fields
    if (!assignmentSubmissionID) {
      return res.status(400).json({ message: "Submission ID is required." });
    }

    // Extract the uploaded file
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "New file is required for updating the submission." });
    }
    console.log("Uploaded file:", file);

    // Check if a submission already exists
    const existingSubmission = await prisma.assignment_submission.findFirst({
      where: {
        id: parseInt(assignmentSubmissionID, 10), // Use the submission ID from params
      },
    });

    if (!existingSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }
    console.log(existingSubmission);

    // Ensure file.objName is defined
    if (!file.objName) {
      console.error("File upload failed, objName is missing.");
      return res.status(400).json({ message: "File upload failed, objName is missing." });
    }

    // Delete the old file from MinIO (if it exists)
    if (existingSubmission.file_path) {
      console.log(existingSubmission.file_path);
      minioClient.removeObject(process.env.MINIO_BUCKET_NAME, existingSubmission.file_path, (err) => {
        if (err) {
          console.error("Error deleting old file:", err);
        } else {
          console.log("Old file deleted successfully");
        }
      });
    }

    const newFilePath = file.objName;
    console.log(newFilePath);
    // Update the file path in the database
    const updatedSubmission = await prisma.assignment_submission.update({
      where: {
        id: existingSubmission.id,
      },
      data: {
        file_path: newFilePath, // Update only the file path
        updated_at: new Date(), // Update the submission timestamp
      },
    });

    console.log("Updated Submission:", updatedSubmission);

    return res.status(200).json({
      message: "Submission updated successfully!",
      updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


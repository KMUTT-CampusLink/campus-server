import prisma from "../../../core/db/prismaInstance.js";
// Controller to create an assignment
export const createAssignment = async (req, res) => {
  try {
    // Extract data from the request body
    const { section_id, title, description, start_date, end_date } = req.body;

    // Validate inputs
    if (!section_id || !title) {
      return res.status(400).json({
        error: 'Section ID and title are required.',
      });
    }

    // Create a new assignment
    const newAssignment = await prisma.assignment.create({
      data: {
        section_id: parseInt(section_id),
        title,
        description: description || null,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    // Return success response
    return res.status(201).json({
      message: 'Assignment created successfully!',
      assignment: newAssignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({
      error: 'An error occurred while creating the assignment.',
    });
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
      orderBy: { create_at: "desc" }, // Optional: order by creation date
    });

    // Return the list of assignments
    return res.status(200).json(
      assignments
    );
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({
      error: "An error occurred while retrieving assignments.",
    });
  }
};



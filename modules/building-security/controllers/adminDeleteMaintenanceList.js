import prisma from "../../../core/db/prismaInstance.js";

export const adminDeleteMaintenanceList = async (req, res) => {
  try {
    const { id } = req.params; // Extract `id` from the request parameters

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required.",
      });
    }

    // Ensure the ID is parsed as an integer
    const deletedRecord = await prisma.maintenance_request.delete({
      where: {
        id: parseInt(id, 10), // Parse the ID as base-10 integer
      },
    });

    res.status(200).json({
      success: true,
      message: "Maintenance request deleted successfully.",
      deletedRecord,
    });
  } catch (error) {
    console.error("Error deleting maintenance request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete the maintenance request.",
      error: error.message,
    });
  }
};

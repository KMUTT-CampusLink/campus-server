import prisma from "../../../core/db/prismaInstance.js"; // Adjust path as needed

export const getMaintenanceList = async (req, res) => {
  try {
    // Query the MaintenanceRequest table for all records
    const maintenanceList = await prisma.maintenance_request.findMany({
      orderBy: { created_at: "desc" }, // Orders by creation date in descending order
    });

    // Send the retrieved list as JSON
    res.status(200).json({
      success: true,
      data: maintenanceList,
    });
  } catch (error) {
    // Log and handle any errors
    console.error("Error fetching maintenance list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve maintenance list",
      error: error.message,
    });
  } finally {
    // Disconnect the Prisma Client
    await prisma.$disconnect();
  }
};

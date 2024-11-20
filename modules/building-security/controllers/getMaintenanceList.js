import prisma from "../../../core/db/prismaInstance.js"; // Adjust path as needed

export const getMaintenanceList = async (req, res) => {
  try {
    const maintenanceList = await prisma.maintenance_request.findMany({
      orderBy: { created_at: "desc" }
    });

    res.status(200).json({
      success: true,
      data: maintenanceList,
    });
  } catch (error) {
    console.error("Error fetching maintenance list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve maintenance list",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

import prisma from "../../../core/db/prismaInstance.js";

export const addMaintenanceList = async (req, res) => {
  const user = req.user;
  const { room_id, type, description, priority, status } = req.body;

  try {
    const newRequest = await prisma.maintenance_request.create({
      data: {
        user_id: user.id,
        room_id,
        type,
        description,
        priority,
        status,
      },
    });

    res.status(201).json({
      success: true,
      data: newRequest,
    });
  } catch (error) {
    console.error("Error adding maintenance request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add maintenance request",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

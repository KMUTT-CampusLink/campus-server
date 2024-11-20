import prisma from "../../../core/db/prismaInstance.js";
import { decodeToken } from "../middleware/jwt.js";

export const addMaintenanceList = async (req, res) => {
  const token = req.cookies.token;
  const decode = decodeToken(token);
  const { room_id, type, description, priority, status } = req.body;

  try {
    // Use decoded user information from req.user
    const newRequest = await prisma.maintenance_request.create({
      data: {
        user_id: decode.id,
        room_id, // Use user ID from the decoded token
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

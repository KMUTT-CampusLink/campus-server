import prisma from "../../../core/db/prismaInstance.js"; // Adjust path as needed

export const updateLostAndFoundList = async (req, res) => {
  const { id } = req.params; // ID from the request params
  const { status } = req.body; // New status from the request body

  try {
    const updatedLostAndFound = await prisma.lost_and_found.update({
      where: { id: parseInt(id) }, // Ensure ID is parsed to an integer
      data: { status },
    });

    res.status(200).json({
      success: true,
      data: updatedLostAndFound,
    });
  } catch (error) {
    console.error("Error updating lost and found item status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lost and found item status",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

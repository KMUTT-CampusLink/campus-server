import prisma from "../../../core/db/prismaInstance.js";

const updateReturnBook = async (req, res) => {
  const { reservation_id, status, duplicateId } = req.body;
  console.log(reservation_id, status, duplicateId); // For debugging

  try {
    const result = await prisma.$transaction([
      prisma.book_reservation.update({
        where: {
          id: reservation_id,
        },
        data: {
          status: status, // Enum value (e.g., "Returned")
        },
      }),
      prisma.book_duplicate.update({
        where: {
          id: duplicateId, // Ensure this is correct
        },
        data: {
          status: true, // Change status to true
        },
      }),
    ]);

    res.status(200).json({
      message: "Book reservation and duplicate status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "Error updating book reservation or duplicate status:",
      error
    );
    res.status(500).json({
      error: "An error occurred while updating the reservation or duplicate.",
    });
  }
};

export { updateReturnBook };

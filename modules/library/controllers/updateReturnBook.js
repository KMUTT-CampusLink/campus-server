import prisma from "../../../core/db/prismaInstance.js";

const updateReturnBook = async (req, res) => {
  const { reservation_id, status, duplicate_id } = req.body;
  console.log(reservation_id, status, duplicate_id); // For debugging

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
          id: duplicate_id, // Ensure this is correct
        },
        data: {
          status: true, // Change status to true
        },
      }),
    ]);
    const book = await prisma.$queryRaw`
    SELECT b.cover_image, b.title, bd.id, bd.status, br.firstname, br.lastname
    FROM book b, book_duplicate bd, (SELECT br1.id, br1.book_duplicate_id, s.firstname, s.lastname
              FROM book_reservation br1, student s
              WHERE br1.user_id = s.user_id
              UNION
              SELECT br1.id, br1.book_duplicate_id,e.firstname, e.lastname
              FROM book_reservation br1, employee e
              WHERE br1.user_id = e.user_id) br
    WHERE b.id = bd.book_id AND br.book_duplicate_id = bd.id 
    AND bd.id = ${duplicate_id} AND br.id = ${reservation_id};
    `;

    res.status(200).json({
      message: "Book reservation and duplicate status updated successfully",
      data: book,
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

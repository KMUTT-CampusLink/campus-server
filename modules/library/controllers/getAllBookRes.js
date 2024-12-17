import prisma from "../../../core/db/prismaInstance.js";

const getAllBookRes = async (req, res) => {
  try {
    const bookRes = await prisma.$queryRaw`
    SELECT b.cover_image, b.title, bd.id, bd.status, br.firstname, br.lastname
    FROM book b, book_duplicate bd
    LEFT JOIN (SELECT br1.book_duplicate_id,s.firstname, s.lastname
              FROM book_reservation br1, student s
              WHERE br1.user_id = s.user_id AND br1.status = 'Reserved'
              UNION
              SELECT br1.book_duplicate_id,e.firstname, e.lastname
              FROM book_reservation br1, employee e
              WHERE br1.user_id = e.user_id AND br1.status = 'Reserved') br
    ON br.book_duplicate_id = bd.id
    WHERE b.id = bd.book_id
    ORDER BY bd.status
  `;
    res.json(bookRes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Book Reservation" });
  }
};

export { getAllBookRes };

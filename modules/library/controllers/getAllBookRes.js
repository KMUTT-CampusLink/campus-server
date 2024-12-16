import prisma from "../../../core/db/prismaInstance.js";

const getAllBookRes = async (req, res) => {
  try {
    const bookRes = await prisma.$queryRaw`
    SELECT br.id id, status, student.firstname, student.lastname, book_duplicate_id, start_date, end_date, unlock_id
    FROM book_reservation br,student
    WHERE br.user_id = student.user_id
    UNION ALL
    SELECT br.id id, status, employee.firstname, employee.lastname, book_duplicate_id, start_date, end_date, unlock_id
    FROM book_reservation br,employee
    WHERE br.user_id = employee.user_id;
  `;
    res.json(bookRes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Book Reservation" });
  }
};

export { getAllBookRes };

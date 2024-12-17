import prisma from "../../../core/db/prismaInstance.js";

const getAllDupeRes = async (req, res) => {
  try {
    const bookList = await prisma.$queryRaw`
      SELECT b.*, bd.id AS duplicate_id, bd.book_id, bd.status as dup_status, 
             br.id AS reservation_id, br.user_id, br.book_duplicate_id as reserved_book, br.start_date, 
             br.end_date, br.status as reserve_status
      FROM book b
      JOIN category c ON c.id = b.category_id
      JOIN book_duplicate bd ON bd.book_id = b.id
      JOIN book_reservation br ON br.book_duplicate_id = bd.id
    `;
    res.json(bookList);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching books, duplicates, and reservations" });
  }
};

export { getAllDupeRes };

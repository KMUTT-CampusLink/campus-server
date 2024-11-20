import prisma from "../../../core/db/prismaInstance.js";
import { decodeToken } from "../middleware/jwt.js";

const getAllDupeRes = async (req, res) => {
  try {
    // Step 1: Decode token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Token not provided." });
    }

    const decode = decodeToken(token);
    if (!decode || !decode.id) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    // Step 2: Query to fetch reservation details based on user_id
    const bookList = await prisma.$queryRaw`
      SELECT b.*, bd.id AS duplicate_id, bd.book_id, bd.status as dup_status, 
             br.id AS reservation_id, br.user_id, br.book_duplicate_id as reserved_book, br.start_date, 
             br.end_date, br.status as reserve_status, br.unlock_id
      FROM book b
      JOIN category c ON c.id = b.category_id
      JOIN book_duplicate bd ON bd.book_id = b.id
      JOIN book_reservation br ON br.book_duplicate_id = bd.id
      WHERE br.user_id = ${decode.id}::uuid
    `;

    // Step 3: Return the fetched data
    res.json(bookList);

  } catch (error) {
    console.error("Error fetching books, duplicates, and reservations:", error);
    res.status(500).json({ error: "Error fetching books, duplicates, and reservations" });
  }
};

export { getAllDupeRes };


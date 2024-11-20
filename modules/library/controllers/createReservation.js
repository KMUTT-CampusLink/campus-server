import prisma from "../../../core/db/prismaInstance.js";
import { decodeToken } from "../middleware/jwt.js"

const createReservation = async (req, res) => {
  const token = req.cookies.token;
  const decode = decodeToken(token);
  const user_id = decode.id;
  const { status, book_duplicate_id, start_date, end_date } = req.body; 

  if (!status ||  !user_id || !book_duplicate_id || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newReservation = await prisma.book_reservation.create({
      data: {
        status,
        user_id,
        book_duplicate_id, // Changed from book_id to book_duplicate_id
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
    });

    res.status(201).json({
      message: "Reservation created successfully!",
      data: newReservation,
    });

    await prisma.book_duplicate.update({
      where: {
        id: book_duplicate_id, // Correct field name
      },
      data: {
        status: false, // Change the status to false
      },
    });


  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createReservation };
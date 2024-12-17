import prisma from "../../../core/db/prismaInstance.js";

const getAllBookRes = async (req, res) => {
  try {
    const bookRes = await prisma.book_reservation.findMany();
    res.json(bookRes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Book Reservation" });
  }
};

export { getAllBookRes };

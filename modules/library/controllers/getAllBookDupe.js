import prisma from "../../../core/db/prismaInstance.js";

const getAllBookDupe = async (req, res) => {
  try {
    const bookDup = await prisma.book_duplicate.findMany();
    res.json(bookDup);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Book Duplicate" });
  }
};

export { getAllBookDupe };

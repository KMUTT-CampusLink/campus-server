import prisma from "../../../core/db/prismaInstance.js";

const getAllBook = async (req, res) => {
  try {
    const bookList = await prisma.book.findMany();
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Book" });
  }
};

export { getAllBook };

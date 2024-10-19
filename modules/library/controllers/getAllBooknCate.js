import prisma from "../../../core/db/prismaInstance.js";

const getAllBooknCate = async (req, res) => {
  try {
    const bookList = await prisma.$queryRaw`
      SELECT b.*, c.title AS category
      FROM book b
      JOIN category c ON c.id = b.category_id
    `;
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching books with categories" });
  }
};

export { getAllBooknCate };
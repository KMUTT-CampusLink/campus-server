import prisma from "../../../core/db/prismaInstance.js";

const getEveryBook = async (req, res) => {
  try {
    // Join book and book_duplicate tables
    const booksWithDuplicates = await prisma.book.findMany({
      include: {
        book_duplicate: true, // Fetch related book_duplicate data
      },
    });

    res.status(200).json(booksWithDuplicates);
  } catch (error) {
    console.error("Error fetching books with duplicates:", error);
    res.status(500).json({ error: "Error fetching books with duplicates" });
  }
};

export { getEveryBook };
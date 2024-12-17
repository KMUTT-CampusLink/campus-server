import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const searchName = async (req, res) => {
  const searchQuery = req.query.search; // Retrieve 'search' from query parameters

  if (!searchQuery) {
    return res.status(400).json({ message: "Query parameter 'search' is required" });
  }

  try {

    const student = await prisma.student.findMany({
      where: {
        OR: [
          { firstname: { contains: searchQuery, mode: "insensitive" } }, 
          { id: {contains: searchQuery, mode: "insensitive"}},
        ],
      },
      select: {
        id: true,
        firstname: true,
        lastname: true
      },
    });

    if (!student) {
      return res.status(404).json({ message: "No student found" });
    }


    return res.status(200).json({
      message: "Student found",
      student,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default searchName;

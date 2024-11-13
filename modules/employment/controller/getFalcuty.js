import prisma from "../../../core/db/prismaInstance.js";

const getFaculties = async (req, res) => {
  try {
    const faculties = await prisma.faculty.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getFaculties;

import prisma from "../../../core/db/prismaInstance.js";

const getSemester = async (req, res) => {
  try {
    const semester = await prisma.semester.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(semester);
  } catch (error) {
    console.error("Error fetching semeseter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getSemester;

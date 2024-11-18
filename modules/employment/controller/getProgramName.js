import prisma from "../../../core/db/prismaInstance.js";

const getProgramName = async (req, res) => {
  try {
    const program = await prisma.degree.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(program);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getProgramName;

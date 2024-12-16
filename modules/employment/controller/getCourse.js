import prisma from "../../../core/db/prismaInstance.js";

const getCourse = async (req, res) => {
  try {
    const course = await prisma.course.findMany({
      select: {
        code: true,
        name: true,
      },
      orderBy: {
        code: "asc",
      },
    });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getCourse;

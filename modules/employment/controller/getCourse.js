import prisma from "../../../core/db/prismaInstance.js";

const getCourse = async (req, res) => {
  try {
    const course = await prisma.section.findMany({
      include: {
        course: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        course: {
          code: "asc",
        },
      },
    });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getCourse;

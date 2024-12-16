import prisma from "../../../core/db/prismaInstance.js";

const getCourseSection = async (req, res) => {
  const { code } = req.params;
  try {
    if (!code) {
      return res.status(400).json({ error: "Course Code is required." });
    }

    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    const data = await prisma.professor.findMany({
      select: {
        employee: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        section: {
          select: {
            name: true,
            day: true,
            start_time: true,
            end_time: true,
            room: {
              select: {
                name: true,
              },
            },
            course: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getCourseSection;

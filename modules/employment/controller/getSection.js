import prisma from "../../../core/db/prismaInstance.js";

const getSection = async (req, res) => {
  const { code, id } = req.params;
  console.log("code:", code);
  console.log("sectionID:", id);

  try {
    if (!code || !id) {
      return res
        .status(400)
        .json({ error: "Course Code and Section ID are required." });
    }

    // Validate that the course exists
    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Validate that the section exists
    const existingSection = await prisma.section.findUnique({
      where: { id: parseInt(id) }, // Ensure `id` is parsed as an integer
    });

    if (!existingSection) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Fetch section details and professor information
    const data = await prisma.professor.findFirst({
      where: { section_id: parseInt(id) }, // Ensure proper filtering for section ID
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

export default getSection;
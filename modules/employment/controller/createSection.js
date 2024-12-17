import prisma from "../../../core/db/prismaInstance.js";

const createSection = async (req, res) => {
  const {
    emp_id,
    name,
    day,
    start_time,
    end_time,
    room_id,
    semester_id,
  } = req.body;
  const { id: course_code } = req.params;

  try {
    // Validate that the course exists
    const courseExists = await prisma.course.findUnique({
      where: { code: course_code },
    });
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Validate that the semester exists
    const semesterExists = await prisma.semester.findUnique({
      where: { id: semester_id },
    });
    if (!semesterExists) {
      return res.status(404).json({ error: "Semester not found" });
    }

    // Check if a professor entry already exists for this emp_id
    let professor = await prisma.professor.findFirst({
      where: { emp_id },
    });

    const result = await prisma.$transaction(async (prisma) => {
      // Create the section
      const newSection = await prisma.section.create({
        data: {
          course: { connect: { code: course_code } },
          name,
          day: day,
          start_time: new Date(start_time),
          end_time: new Date(end_time),
          semester: { connect: { id: semester_id } },
          room: room_id ? { connect: { id: room_id } } : undefined,
        },
      });

      // Create a new professor linked to the section
      const newProfessor = await prisma.professor.create({
        data: {
          emp_id,
          section_id: newSection.id,
        },
      });

      return { newSection, newProfessor };
    });

    res.json({
      message: "Section created successfully",
      section: result.newSection,
      professor: result.newProfessor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the section." });
  }
};

export default createSection;

import prisma from "../../../core/db/prismaInstance.js";

const updateSection = async (req, res) => {
  const { emp_id, name, day, start_time, end_time, room_id, semester_id } =
    req.body;
  const { code, id } = req.params;
  const sectionId = parseInt(id); // Parse section ID to an integer
  console.log("code:", code);
  console.log("sectionID:", sectionId);

  try {
    // Validate that the section exists
    const sectionExists = await prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!sectionExists) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Validate that the semester exists
    if (semester_id) {
      const semesterExists = await prisma.semester.findUnique({
        where: { id: semester_id },
      });
      if (!semesterExists) {
        return res.status(404).json({ error: "Semester not found" });
      }
    }

    // Check if the professor entry needs to be updated
    let professor = emp_id
      ? await prisma.professor.findFirst({
          where: { emp_id, section_id: sectionId },
        })
      : null;

    const result = await prisma.$transaction(async (prisma) => {
      // Update the section
      const updatedSection = await prisma.section.update({
        where: { id: sectionId },
        data: {
          name: name || sectionExists.name,
          day: day || sectionExists.day,
          start_time: start_time
            ? new Date(start_time)
            : sectionExists.start_time,
          end_time: end_time ? new Date(end_time) : sectionExists.end_time,
          semester: semester_id ? { connect: { id: semester_id } } : undefined,
          room: room_id ? { connect: { id: room_id } } : undefined,
        },
      });

      // Update the professor if emp_id is provided
      if (emp_id) {
        if (professor) {
          professor = await prisma.professor.update({
            where: { id: professor.id },
            data: { emp_id },
          });
        } else {
          professor = await prisma.professor.create({
            data: { emp_id, id: sectionId },
          });
        }
      }

      return { updatedSection, professor };
    });

    res.json({
      message: "Section updated successfully",
      section: result.updatedSection,
      professor: result.professor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the section." });
  }
};

export default updateSection;

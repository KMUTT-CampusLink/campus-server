import prisma from "../../../core/db/prismaInstance.js";

const updateSection = async (req, res) => {
  const {
    firstname,
    midname,
    lastname,
    name,
    day,
    start_time,
    end_time,
    room_name,
    id,
  } = req.body;

  try {
    const sectionId = parseInt(id); // Parse section ID to an integer

    // Validate the section exists
    const sectionExists = await prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!sectionExists) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Find emp_id using firstname, midname, and lastname
    const employee = await prisma.employee.findFirst({
      where: {
        firstname,
        midname: midname || undefined,
        lastname,
      },
      select: { id: true },
    });

    if (!employee) {
      return res
        .status(404)
        .json({ error: `Employee with name '${firstname} ${lastname}' not found` });
    }

    const emp_id = employee.id; // Extract the emp_id

    // Find room_id using room_name
    const room = await prisma.room.findFirst({
      where: { name: room_name },
      select: { id: true },
    });

    if (!room) {
      return res
        .status(404)
        .json({ error: `Room with name '${room_name}' not found` });
    }

    const room_id = room.id; // Extract the room_id

    // Perform the updates within a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update the section table
      const updatedSection = await prisma.section.update({
        where: { id: sectionId },
        data: {
          name: name || sectionExists.name,
          day: day || sectionExists.day,
          start_time: start_time ? new Date(start_time) : sectionExists.start_time,
          end_time: end_time ? new Date(end_time) : sectionExists.end_time,
          room: {
            connect: { id: room_id },
          },
        },
      });

      // Check if a professor entry exists for the section
      let professor = await prisma.professor.findFirst({
        where: { section_id: sectionId },
      });

      // Update or create the professor record
      if (professor) {
        professor = await prisma.professor.update({
          where: { id: professor.id },
          data: { emp_id },
        });
      } else {
        professor = await prisma.professor.create({
          data: { emp_id, section_id: sectionId },
        });
      }

      return { updatedSection, professor };
    });

    res.json({
      message: "Section and professor updated successfully",
      section: result.updatedSection,
      professor: result.professor,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default updateSection;

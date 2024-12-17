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
    emp_id,
  } = req.body;
  const { code, id } = req.params;
  console.log("opara", req.params);
  console.log("opara", req.body);

  try {
    const sectionId = parseInt(id); // Parse section ID to an integer

    // Validate the section exists
    const sectionExists = await prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!sectionExists) {
      return res.status(404).json({ error: "Section not found" });
    }

    const room = await prisma.room.findFirst({
      where: { name: room_name },
      select: { id: true },
    });

    if (!room) {
      return res
        .status(404)
        .json({ error: `Room with name '${room_name}' not found` });
    }

    const room_id = room.id;

    const convertTimeToISODateTime = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(":");
      const date = new Date();
      date.setUTCHours(
        parseInt(hours, 10),
        parseInt(minutes, 10),
        parseInt(seconds || 0, 10),
        0
      ); // Set time
      return date.toISOString(); // Converts to "1970-01-01T16:00:00.000Z"
    };

    // Example Usage
    const startTime = convertTimeToISODateTime(start_time);
    const endTime = convertTimeToISODateTime(end_time);

    const result = await prisma.$transaction(async (prisma) => {
      // Update the section table
      const updatedSection = await prisma.section.update({
        where: { id: sectionId },
        data: {
          name: name || sectionExists.name,
          day: day || sectionExists.day,
          start_time: startTime ? startTime : sectionExists.start_time,
          end_time: endTime ? endTime : sectionExists.end_time,
          room: {
            connect: { id: room_id },
          },
        },
      });

      const existingProfessor = await prisma.professor.findFirst({
        where: {
          emp_id: sectionExists.emp_id,
          section_id: sectionId,
        },
      });

      let professor;

      if (existingProfessor) {
        // Update the existing professor record
        professor = await prisma.professor.update({
          where: { id: existingProfessor.id }, // Use the unique primary key
          data: { emp_id: emp_id, section_id: sectionId },
        });
      } else {
        // Create a new professor record
        professor = await prisma.professor.create({
          data: { emp_id, section_id: sectionId },
        });
      }

      console.log(updatedSection);
      console.log("exis", existingProfessor);
      console.log("updataed", professor);
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

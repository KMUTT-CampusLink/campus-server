import prisma from "../../../core/db/prismaInstance.js";

const createSection = async (req, res) => {
  const {
    firstname,
    midname,
    lastname,
    id,
    name,
    day,
    start_time,
    end_time,
    room_name,
    semester_id,
  } = req.body;
  const { code } = req.params;
  console.log("btihc", req.body);

  try {
    // Validate that the course exists
    const courseExists = await prisma.course.findUnique({
      where: { code },
    });
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if a professor entry already exists for this emp_id
    let professor = await prisma.employee.findUnique({
      where: { id },
    });

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
    const combineTimeWithDate = (timeString) => {
      const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
      const [hours, minutes, seconds] = timeString.split(":"); // Split time string into components

      // Create a UTC Date object with today's date and specified time
      const utcDate = new Date(
        Date.UTC(
          parseInt(today.split("-")[0]), // Year
          parseInt(today.split("-")[1]) - 1, // Month (0-indexed)
          parseInt(today.split("-")[2]), // Day
          parseInt(hours), // Hours
          parseInt(minutes), // Minutes
          parseInt(seconds || "0") // Seconds (default to 0 if not provided)
        )
      );

      return utcDate.toISOString(); // Return ISO string in UTC format
    };

    // Example usage:
    const startTime = combineTimeWithDate(start_time); // "2024-06-17T11:00:00.000Z"
    const endTime = combineTimeWithDate(end_time);

    const result = await prisma.$transaction(async (prisma) => {
      // Create the section
      const newSection = await prisma.section.create({
        data: {
          course: { connect: { code } },
          name,
          day: day,
          start_time: startTime,
          end_time: endTime,
          semester: { connect: { id: 1165 } },
          room: {
            connect: { id: room_id },
          },
        },
      });

      // Create a new professor linked to the section
      const newProfessor = await prisma.professor.create({
        data: {
          emp_id: id,
          section_id: parseInt(newSection.id),
        },
      });
      console.log(newProfessor);

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

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const generateFaceRecAttendance = async (req, res) => {
  const secId = parseInt(req.params.secId);
  const empId = req.user.employeeId;
  const professorId = await prisma.professor.findFirst({
    where: {
      id: empId,
    },
    select: {
      id: true,
    },
  })


  try {
    // Check if the section exists
    const section = await prisma.section.findFirst({
      where: { id: secId },
    });

    if (!section) {
      return res.status(400).json({ message: "Invalid Section Id" });
    }

    // Check for ongoing attendance for the section and professor
    const onGoing = await prisma.attendance.findFirst({
      where: {
        section_id: secId,
        professor_id: professorId.id,
        end_at: { gt: new Date() },
      },
    });

    if (onGoing !== null) {
      // Ongoing attendance session found
      return res.status(200).json({
        status: "Attendance in progress",
        attendanceId: onGoing.id,
        message: "Ongoing attendance session is already active.",
      });
    }

    // Create a new attendance session
    const newAttendance = await prisma.attendance.create({
      data: {
        section_id: secId,
        professor_id: professorId.id,
        start_at: new Date(),
        end_at: new Date(new Date().getTime() + 1 * 60 * 1000), // Session ends in 15 minutes
      },
    });

    res.status(201).json({
      status: "New attendance created",
      attendanceId: newAttendance.id,
      message: "Attendance session started successfully for face recognition.",
    });
  } catch (error) {
    console.error("Error details:", error); // Log detailed error for debugging
    res.status(500).json({
      message: "Error generating attendance session",
      error: error.message,
    });
  }
};

export default generateFaceRecAttendance;
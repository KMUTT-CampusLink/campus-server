import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const markAttendance = async (req, res) => {
  const { studentId, attendanceId } = req.body;
  
  try {
    if (!studentId) {
      return res.status(400).json({ success: false, message: "Missing StudentId" });
    }

    const student = await prisma.student.findFirst({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(400).json({ success: false, message: "Student Not Found" });
    }

    const attendances = await prisma.attendance.findFirst({
      where: { id: attendanceId },
      select: { section_id: true, end_at: true },
    });
    
    if (!attendances) {
      return res.status(400).json({ success: false, message: "Attendance Not Found" });
    }

    const secId = attendances.section_id;

    // Check if the student is enrolled in this section
    const enrollStudent = await prisma.enrollment_detail.findFirst({
      where: {
        student_id: studentId,
        section_id: secId,
      }
    });

    if (!enrollStudent) {
      return res.status(400).json({ success: false, message: "Student is not enrolled in this section" });
    }

    const isStudentExist = await prisma.class_attendance.findFirst({
      where: { attendance_id: attendanceId, student_id: studentId },
    });

    if (isStudentExist) {
      return res.status(400).json({ success: false, message: "You already scanned this QR code" });
    }

    if (attendances.end_at.getTime() < new Date().getTime()) {
      return res.status(400).json({ success: false, message: "Time is up" });
    }

    await prisma.class_attendance.create({
      data: {
        student_id: studentId,
        status: "Present",
        section_id: secId,
        attendance_id: attendanceId,
      },
    });

    return res.status(200).json({ success: true, message: "Attendance Process Success" });
    
  } catch (error) {
    console.error("Error in markAttendance:", error);  // Log the error details
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

  

export { markAttendance };
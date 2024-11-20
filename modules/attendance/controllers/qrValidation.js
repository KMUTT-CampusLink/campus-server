import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validateQrCodeController = async (req, res) => {
  const attendanceId = parseInt(req.params.attendanceId);
  try {
    // TODO: get student token
    const MOCK_STUDENT_ID = "STU00022";
    const studentId = MOCK_STUDENT_ID;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Missing StudentId" });
    }

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(400).json({ success: false, message: "Student Not Found" });
    }


    const attendances = await prisma.attendance.findFirst({
      where: {
        id: attendanceId,
      },
      select: {
        section_id: true,
        end_at: true,
      }
    });
    const secId = attendances.section_id;
    const isStudentExist = await prisma.class_attendance.findFirst({
      where: {
        attendance_id: attendanceId,
        student_id: studentId,
      },
    });
    if( isStudentExist){
      return res.status(400).json({ success: false, message: "You Already Scanned this QR code" });
    }
    if (!attendances) {
      return res.status(400).json({ success: false, message: "Attendance Not Found" });
    }

    if (attendances.end_at.getTime() < new Date().getTime()) {
      return res.status(400).json({ success: false, message: "Time Up" });
    }


    await prisma.class_attendance.create({
      data: {
        student_id: studentId,
        status: "Present",
        section_id: secId,
        attendance_id: attendanceId
      },
    });

    return res.status(200).json({ success: true, message: "Attendance Process Success" });
  } catch (e) {
    console.log(e);
    
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { validateQrCodeController };

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validateQrCodeController = async (req, res) => {
  const attendanceId = parseInt(req.params.attendanceId);
  try {
    // TODO: get student token
    const MOCK_STUDENT_ID = "STU00022";
    const studentId = MOCK_STUDENT_ID;

    if (!studentId) {
      return res.status(400).json("Missing StudentId");
    }

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(400).json("Student Not Found");
    }


    const attendances = await prisma.attendance_qr_code.findFirst({
      where: {
        id: attendanceId,
      },
    });
    const isStudentExist = await prisma.class_attendance.findFirst({
      where: {
        attendance_qr_code_id: attendanceId,
        student_id: studentId,
      },
    });
    if (isStudentExist) {
      return res.status(400).json("You Already Scanned this Qrcode");
    }
    if (!attendances) {
      return res.status(400).json("Attendence Not Found");
    }

    if (attendances.end_at.getTime() < new Date().getTime()) {
      return res.status(400).json("Time Up");
    }


    await prisma.class_attendance.create({
      data: {
        student_id: studentId,
        status: "Present",
        attendance_qr_code_id: attendanceId
      },
    });

    return res.status(200).json("Attendance Process Sucess");
  } catch (e) {
    console.log(e);
    
    return res.status(500).json("Internal Server Error " + e);
  }
};

export { validateQrCodeController };

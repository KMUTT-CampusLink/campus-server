import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateAttendance = async (req, res) => {
  const { studentId, sectionId, status, created_at } = req.body;
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

    if (!sectionId) {
      return res.status(400).json({ success: false, message: "Missing SectionId" });
    }
    const section = await prisma.section.findFirst({
      where: { id: sectionId },
    });
    if (!section) {
      return res.status(400).json({ success: false, message: "Section Not Found" });
    }

    const enrollStudent = await prisma.enrollment_detail.findFirst({
      where: {
        student_id: studentId,
        section_id: sectionId,
      }
    });
    if (!enrollStudent) {
      return res.status(400).json({ success: false, message: "Student is not enrolled in this section" });
    }

    if(status == "Present"){
      await prisma.class_attendance.create({
      data: {
        student_id: studentId,
        section_id: sectionId,
        status: status,
        created_at: new Date(`${created_at}T00:00:00.000Z`)
      },
    });
    }
    else{
      await prisma.class_attendance.deleteMany({
        where:{
          student_id: studentId,
          section_id: sectionId,
          created_at: {
            gte: new Date(`${created_at}T00:00:00.000Z`),
            lt: new Date(`${created_at}T23:59:59.999Z`),
          },
        }
      });
    }

    
    res.status(200).json({ success: true, created_at: new Date().toISOString().split('T')[0]  });
  } catch (error) {
    console.error("Error details:", error); // Detailed logging
    res
      .status(500)
      .json({ message: "Error updated attendance", error: error.message });
  }
};

export default updateAttendance;

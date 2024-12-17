import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getStudentAttendance = async (req, res) => {
  try {
    const { sectionID } = req.params;
    const studentId  = req.user.studentId;
    const section_id = parseInt(sectionID)
    if (!sectionID) {
      return res.status(400).json("No Section Id");
    }
    const attendanceData = await prisma.$queryRaw`
      SELECT DISTINCT ON (d.created_at, ed.student_id) 
      TO_CHAR(d.created_at,'YYYY-MM-DD') as created_at, ed.student_id, s.firstname, s.midname, s.lastname, COALESCE(ca.status, 'Absent') AS status
      FROM (SELECT DISTINCT created_at::date FROM class_attendance WHERE section_id = ${section_id}) as d
      CROSS JOIN enrollment_detail ed
      JOIN student s ON ed.student_id = s.id
      LEFT JOIN class_attendance ca ON ed.student_id = ca.student_id AND d.created_at = ca.created_at::date
      WHERE ed.student_id = ${studentId} AND ed.section_id = ${section_id}
      ORDER BY d.created_at desc, ed.student_id;`
    return res.status(200).json({
      success: true,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance data",
    });
  }
};

export default getStudentAttendance;
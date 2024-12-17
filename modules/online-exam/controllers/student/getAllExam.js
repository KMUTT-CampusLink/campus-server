import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function getAllExam(req, res) {
  const token = req.cookies.token;
  const sectionid = parseInt(req.query.sectionid);
  try {
    const decoded = decodeToken(token);
    const id = decoded.id;
    const queryStudentData = await prisma.student.findUnique({
      where: {
        user_id: id,
      },
      select: {
        id: true,
      },
    });
    const queryStudentExam = await prisma.$queryRaw`
      SELECT id 
      FROM exam 
      WHERE section_id = ${sectionid} 
      AND start_date <= NOW() 
      AND end_date >= NOW() 
      AND publish_status = true 
      AND id NOT IN (
          SELECT exam_id 
          FROM student_exam 
          WHERE student_id = ${queryStudentData.id})
      AND NOT EXISTS (
              SELECT 1 
              FROM enrollment_detail 
              WHERE student_id = ${queryStudentData.id} 
              AND section_id = ${sectionid} 
              AND status = 'Withdraw')`;
    const examIds = queryStudentExam.map((exam) => exam.id);
    const queryExam = await prisma.exam.findMany({
      where: {
        id: { in: examIds },
      },
      select: {
        id: true,
        title: true,
      },
    });
    const course =
      await prisma.$queryRaw`SELECT c.name FROM course AS c, section AS s WHERE s.id = ${sectionid} AND s.course_code = c.code`;
    return res
      .status(200)
      .json({
        message: "All exams fetched",
        exam: queryExam,
        courseTitle: course,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

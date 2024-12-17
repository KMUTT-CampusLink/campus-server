import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function getAllExam(req, res) {
  const token = req.cookies.token;
  const sectionId = parseInt(req.query.sectionId);
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
    const queryStudentExam = await prisma.$queryRaw`SELECT id FROM exam WHERE section_id = ${sectionId} AND start_date <= NOW() AND end_date >= NOW() AND publish_status = true AND id NOT IN (SELECT exam_id FROM student_exam WHERE student_id = ${queryStudentData.id})`;
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
    return res
      .status(200)
      .json({ message: "All exams fetched", data: queryExam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

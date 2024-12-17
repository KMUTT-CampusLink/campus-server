import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function toggleExamStatus(req, res) {
  const examId = parseInt(req.body.examId);
  const token = req.cookies.token;
  try {
    const decoded = decodeToken(token);
    const userId = decoded.id;
    const studentQuery = await prisma.$queryRaw`SELECT id FROM student WHERE user_id = ${userId}::uuid`;
    const studentExam = await prisma.$queryRaw`SELECT id FROM student_exam WHERE student_id = ${studentQuery[0].id} AND exam_id = ${examId}`;
    await prisma.$queryRaw`UPDATE student_exam SET status = 'Completed' WHERE id = ${studentExam[0].id}`;
    const examQuery = await prisma.$queryRaw`SELECT section_id FROM exam WHERE id = ${examId}`;
    return res
      .status(200)
      .json({ message: "Exam status updated successfully", data: examQuery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

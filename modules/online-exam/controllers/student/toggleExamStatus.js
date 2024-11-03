import prisma from "../../../../core/db/prismaInstance.js";

export default async function toggleExamStatus(req, res) {
  const examId = parseInt(req.body.examId);
  const studentId = "66130500849";
  try {
    const studentExam = await prisma.$queryRaw`SELECT id FROM student_exam WHERE student_id = ${studentId} AND exam_id = ${examId}`;
    await prisma.$queryRaw`UPDATE student_exam SET status = 'Completed' WHERE id = ${studentExam[0].id}`;
    return res
      .status(200)
      .json({ message: "Exam status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getStudentScore(req, res) {
  const studentExamId = parseInt(req.query.id);
  try {
    const queryStudentExam = await prisma.student_exam.findUnique({
      where: {
        id: studentExamId,
      },
      select: {
        total_score: true,
      },
    });
    res.status(200).json({
      data: queryStudentExam,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

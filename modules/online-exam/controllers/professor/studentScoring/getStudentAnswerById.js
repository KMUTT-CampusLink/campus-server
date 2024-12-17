import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getStudentAnswerById(req, res) {
  const examId = parseInt(req.query.examId);
  const studentId = req.query.studentId;
  try {
    const queryStudentAnswer = await prisma.student_answer.findMany({
        where: {
            exam_id: examId,
            student_id: studentId,
        },
        select: {
            question_id: true,
            answer: true,
            ans_correct: true,
        },
    })
    res.status(200).json({
        data: queryStudentAnswer
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

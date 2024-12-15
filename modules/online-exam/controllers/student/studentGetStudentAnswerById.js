import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function studentGetStudentAnswerById(req, res) {
  const examId = parseInt(req.query.examId);
  const questionId = parseInt(req.query.questionId);
  const token = req.cookies.token;
  try {
    const decoded = decodeToken(token);
    const userId = decoded.id;
    const studentQuery = await prisma.student.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
      },
    });
    const queryStudentAnswer = await prisma.student_answer.findFirst({
      where: {
        exam_id: examId,
        question_id: questionId,
        student_id: studentQuery.id,
      },
      select: {
        question_id: true,
        answer: true,
        ans_correct: true,
        essay_comment: true,
      },
    });
    res
      .status(200)
      .json(queryStudentAnswer.essay_comment ? queryStudentAnswer : null);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

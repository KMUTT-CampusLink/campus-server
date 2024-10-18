import prisma from "../../../../../core/db/prismaInstance.js";

export default async function deleteExamById(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const questions = await prisma.exam_question.findMany({
      where: {
        exam_id: examId,
      },
      select: {
        id: true,
      },
    });
    const questionIds = questions.map((question) => question.id);
    await prisma.exam_choice.deleteMany({
      where: {
        question_id: { in: questionIds },
      },
    });
    await prisma.exam_question.deleteMany({
      where: {
        exam_id: examId,
      },
    });
    await prisma.exam.delete({
      where: {
        id: examId,
      },
    });
    return res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

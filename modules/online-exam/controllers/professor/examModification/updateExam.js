import prisma from "../../../../../core/db/prismaInstance.js";

export default async function updateExam(req, res) {
  const { examId, title, description, questions } = req.body;
  try {
    await prisma.exam.update({
      where: { id: parseInt(examId) },
      data: { title, description },
    });

    const queryQuestion = await prisma.exam_question.findMany({
      where: {
        exam_id: parseInt(examId),
      },
    });
    const questionIds = queryQuestion.map((question) => question.id);

    await prisma.exam_choice.deleteMany({
        where: {
            question_id: { in: questionIds },
        },
    });
    await prisma.exam_question.deleteMany({
      where: { exam_id: parseInt(examId) },
    });
    for (const question of questions) {
      const queryQuestionRaw = await prisma.$queryRaw`
        INSERT INTO "exam_question" ("exam_id", "type", "title", "mark") 
        VALUES (${parseInt(examId)}, ${question.type}::question_type_enum, ${
        question.questionText
      }, ${question.score}) 
        RETURNING id`;
      const questionId = queryQuestionRaw[0].id;
      // Check if the question type has options (Multiple Choice or Checklist)
      if (
        question.type === "Multiple Choice" ||
        question.type === "Checklist"
      ) {
        for (const option of question.options) {
          const isCorrect = (question.answer || []).includes(option.choiceText);
          await prisma.exam_choice.create({
            data: {
              question_id: questionId,
              choice_text: option.choiceText,
              choice_img: option.choiceImg || null,
              correct_ans: isCorrect,
            },
          });
        }
      }
    }
    res.status(200).json({ message: "Exam updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

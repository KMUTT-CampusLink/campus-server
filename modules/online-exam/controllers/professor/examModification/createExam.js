import prisma from "../../../../../core/db/prismaInstance.js";

export default async function createExam(req, res) {
  const { exam } = req.body;
  const title = exam.title;
  const description = exam.description;
  try {
    const queryExamRaw = await prisma.exam.create({
      data: {
        title,
        description
      },
      select: {
        id: true
      }
    });
    const examId = queryExamRaw.id;
    for (const [index, question] of exam.questions.entries()) {
      let score = question.score;
      if (question.type === "Checklist"){
          score = question.score / question.answer.length;
      }
      const queryQuestionRaw = await prisma.$queryRaw`INSERT INTO "exam_question" ("exam_id", "type", "title", "mark") 
                                                      VALUES (${examId}, ${question.type}::question_type_enum, ${question.questionText}, ${score}) 
                                                      RETURNING id`;
      const questionId = queryQuestionRaw[0].id;
      if ( question.type === "Multiple Choice" || question.type === "Checklist" ) {
        for (let i = 0;i < question.options.length;i++) {
          const isCorrect = (question.answer || []).includes(question.options[i]);
          await prisma.exam_choice.create({
            data: {
              question_id: questionId,
              choice_text: question.options[i],
              correct_ans: isCorrect
            }
          });          
        }
      }
    }
    res.status(200).json({ message: "Exam created successfully", data: examId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

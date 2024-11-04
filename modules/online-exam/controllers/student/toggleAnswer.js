import prisma from "../../../../core/db/prismaInstance.js";

export default async function toggleAnswer(req, res) {
  const examId = parseInt(req.query.examId);
  const studentId = "66130500849";

  try {
    const studentAns = await prisma.student_answer.findMany({
      where: {
        exam_id: examId,
        student_id: studentId,
      },
      select: {
        id: true,
        student_id: true,
        question_id: true,
        answer: true,
      },
    });
    const queryQuestion = await prisma.exam_question.findMany({
      where: {
        exam_id: examId,
      },
      select: {
        id: true,
      },
    });
    const questionId = queryQuestion.map((item) => item.id);
    const correctAns = await prisma.exam_choice.findMany({
      where: {
        question_id: { in: questionId },
        correct_ans: true,
      },
      select: {
        question_id: true,
        correct_ans: true,
        choice_text: true,
      },
    });
    for (let i = 0; i < studentAns.length; i++) {
      var check = false;
      for (let j = 0; j < correctAns.length; j++) {
        if (
          studentAns[i].question_id == correctAns[j].question_id &&
          studentAns[i].answer == correctAns[j].choice_text
        ) {
          await prisma.$queryRaw`UPDATE student_answer SET ans_correct = true WHERE id = ${studentAns[i].id}`;
          check = true;
          break;
        }
      }
      if (!check) {
        await prisma.$queryRaw`UPDATE student_answer SET ans_correct = false WHERE id = ${studentAns[i].id}`;
      }
    }
    res.status(200).json({ message: "Exam submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

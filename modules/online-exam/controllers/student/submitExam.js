import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function submitExam(req, res) {
  const start = new Date();
  const examId = parseInt(req.body.examId);
  const studentAnswers = req.body.studentAnswers;
  const token = req.cookies.token;
  const answersArray = Object.values(studentAnswers).flat();
  try {
    const decoded = decodeToken(token);
    const userId = decoded.id;
    const studentData = await prisma.student.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
      },
    });
    if (!studentData) {
      return res.status(400).json({ message: "Student not found" });
    }
    await prisma.student_answer.createMany({
      data: answersArray.map((answer) => {
        return {
          exam_id: examId,
          question_id: answer.question_id,
          student_id: studentData.id,
          answer: answer.choiceText,
        };
      }),
    });
    const score = await prisma.exam_question.findMany({
      where: {
        exam_id: examId,
      },
      select: {
        id: true,
        mark: true,
      },
    });
    const questionId = score.map((s) => s.id);

    const examsData = await prisma.exam_question.findMany({
      where: {
        id: { in: questionId },
      },
      select: {
        type: true,
        mark: true,
        id: true,
      },
    });

    const choicesData = await prisma.exam_choice.findMany({
      where: {
        question_id: { in: questionId },
      },
      select: {
        id: true,
        choice_text: true,
        correct_ans: true,
        question_id: true,
      },
    });

    let totalScore = 0;

    questionId.map((qId, index) => {
      const question = examsData.find((q) => q.id === qId);
      const choices = choicesData.filter((c) => c.question_id === qId);
      if (question.type === "Essay") return;
      if (question.type === "Multiple_Choice") {
        const correctChoice = choices.find((c) => c.correct_ans === true);
        const studentAnswer = answersArray[index].choiceText;
        if (correctChoice.choice_text === studentAnswer) {
          totalScore += parseFloat(question.mark);
        }
        return;
      }
      if (question.type === "Checklist") {
        const submitted = answersArray.filter((a) =>
          choices.find((c) => c.id === a.choiceId)
        );
        const cAmount = choices.length;
        let correctCount = 0;
        choices.map((c) => {
          const match = submitted.find((s) => c.id === s.choiceId);
          if ((c.correct_ans && match) || (!c.correct_ans && !match)) {
            correctCount += 1;
          }
        });
        if (correctCount === cAmount) {
          totalScore += Math.round(parseFloat(question.mark * cAmount));
        } else {
          totalScore += parseFloat(question.mark * cAmount);
        }
      }
    });
    const stu_exam = await prisma.student_exam.findFirst({
      where: {
        student_id: studentData.id,
        exam_id: examId,
      },
    });
    if (!stu_exam) {
      return res.status(400).json({ message: "Student Exam Data Not Found" });
    }
    await prisma.student_exam.update({
      where: {
        id: stu_exam.id,
      },
      data: {
        total_score: totalScore,
        status: "Completed",
      },
    });
    const finish = new Date();
    res.status(200).json({
      message: `Exam submitted successfully by ${
        finish.getTime() - start.getTime()
      } ms`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

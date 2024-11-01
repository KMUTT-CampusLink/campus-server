import prisma from "../../../../core/db/prismaInstance.js";

export default async function submitExam(req, res) {
  const examId = parseInt(req.body.examId);
  const studentAnswers = req.body.studentAnswers;
  const answersArray = Object.values(studentAnswers).flat();
  try {
    await Promise.all(
      answersArray.map(async (answer) => {
        await prisma.student_answer.create({
          data: {
            exam_id: examId,
            question_id: answer.question_id,
            student_id: '1',
            answer: answer.choiceText,
          },
        });
      })
    );

    res.status(200).json({ message: "Exam submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

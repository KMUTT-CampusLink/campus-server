import prisma from "../../../../core/db/prismaInstance.js";

export default async function submitExam(req, res) {
  const examId = parseInt(req.body.examId);
  const studentAnswers = req.body.studentAnswers;
  const studentId = "66130500850";
  const answersArray = Object.values(studentAnswers).flat();
  try {
    await Promise.all(
      answersArray.map(async (answer) => {
        await prisma.student_answer.create({
          data: {
            exam_id: examId,
            question_id: answer.question_id,
            student_id: studentId,
            answer: answer.choiceText,
          },
        });
      })
    );
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
    const correctChoice = await prisma.exam_choice.findMany({
      where: {
        question_id: { in: questionId },
        correct_ans: true,
      },
      select: {
        id: true,
        question_id: true,
      },
    });
    let totalScore = 0;
    answersArray.map((answer) => {
      const questionScore = score.find((s) => s.id === answer.question_id).mark;
      let correct = false;
      for(let i = 0;i < correctChoice.length;i++){
        if(answer.choiceId === correctChoice[i].id){
          correct = true;
        }        
      }
      if (correct) {
        totalScore += parseFloat(questionScore);
      }
    });
    console.log(totalScore);
    await prisma.$queryRaw`UPDATE student_exam SET total_score = ${totalScore} WHERE student_id = ${studentId} AND exam_id = ${examId};`;
    res.status(200).json({ message: "Exam submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

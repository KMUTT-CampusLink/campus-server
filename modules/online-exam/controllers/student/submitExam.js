import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function submitExam(req, res) {
  const examId = parseInt(req.body.examId);
  const studentAnswers = req.body.studentAnswers;
  const token = req.cookies.token;
  const answersArray = Object.values(studentAnswers).flat();
  try {
    const decoded = decodeToken(token);
    const userId = decoded.id;
    const studentQuery =
      await prisma.$queryRaw`SELECT id FROM student WHERE user_id = ${userId}::uuid`;
    await Promise.all(
      answersArray.map(async (answer) => {
        await prisma.student_answer.create({
          data: {
            exam_id: examId,
            question_id: answer.question_id,
            student_id: studentQuery[0].id,
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
    let totalScore = 0;
    for (let i = 0; i < questionId.length; i++) {
      const examQuerry =
        await prisma.$queryRaw`SELECT type, mark FROM exam_question WHERE id = ${questionId[i]}`;
      const choiceQuerry =
        await prisma.$queryRaw`SELECT id, choice_text, correct_ans FROM exam_choice WHERE question_id = ${questionId[i]}`;
      if (examQuerry[0].type != "Essay") {
        if (examQuerry[0].type === "Multiple Choice") {
          const correctChoice = choiceQuerry.find(
            (choice) => choice.correct_ans === true
          );
          if (correctChoice.choice_text === answersArray[i].choiceText) {
            totalScore += parseFloat(examQuerry[0].mark);
          }
        } else if (examQuerry[0].type === "Checklist") {
          const ansChoice = choiceQuerry
            .filter((choice) => choice.correct_ans === true)
            .flat();
          const notAnsChoice = choiceQuerry
            .filter((choice) => choice.correct_ans === false)
            .flat();
          const mark = parseFloat(examQuerry[0].mark);
          ansChoice.forEach((correctChoice) => {
            const studentAnswer = answersArray.find((answer) => answer.choiceId === correctChoice.id);
            if (studentAnswer) {
              totalScore += mark;
            }
          });
          notAnsChoice.forEach((incorrectChoice) => {
            const studentAnswer = answersArray.find((answer) => answer.choiceId === incorrectChoice.id);
            if (!studentAnswer) {
              totalScore += mark;
            }
          });
        }
      }
    }
    // });
    // const correctChoice = await prisma.exam_choice.findMany({
    //   where: {
    //     question_id: { in: questionId },
    //     correct_ans: true,
    //   },
    //   select: {
    //     id: true,
    //     question_id: true,
    //   },
    // });
    // let totalScore = 0;
    // answersArray.map(async (answer) => {
    //   const questionScore = score.find((s) => s.id === answer.question_id).mark;
    //   let correct = false;
    //   for(let i = 0;i < correctChoice.length;i++){
    //     if(answer.choiceId === correctChoice[i].id){
    //       correct = true;
    //     }
    //   }
    //   if (correct) {
    //     totalScore += parseFloat(questionScore);
    //   }
    // });
    await prisma.$queryRaw`UPDATE student_exam SET total_score = ${totalScore} WHERE student_id = ${studentQuery[0].id} AND exam_id = ${examId};`;
    res.status(200).json({ message: "Exam submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getStudentScoreById(req, res) {
  const questionId = parseInt(req.query.id);
  const studentId = req.query.studentId;
  try {
    const questionType =
      await prisma.$queryRaw`SELECT type, mark FROM exam_question WHERE id = ${questionId}`;
    if (questionType[0].type == "Essay") {
      const studentScore =
        await prisma.$queryRaw`SELECT essay_score FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId}`;
      res.json(parseFloat(studentScore[0].essay_score));
    } else if (questionType[0].type == "Multiple Choice") {
      const studentScore =
        await prisma.$queryRaw`SELECT count(*) FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId} AND ans_correct = true`;
      res.json(parseFloat(studentScore[0].count) * questionType[0].mark);
    } else {
      const choiceAmount =
        await prisma.$queryRaw`SELECT count(*) FROM exam_choice WHERE question_id = ${questionId}`;
      const studentScore =
        await prisma.$queryRaw`SELECT count(*) FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId} AND ans_correct = true`;
      const studnetScore2 =
        await prisma.$queryRaw`SELECT count(*) FROM exam_choice WHERE question_id = ${questionId} AND correct_ans = false AND choice_text NOT IN (SELECT answer FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId})`;
        const studentTotalScore = choiceAmount[0].count === studentScore[0].count + studnetScore2[0].count ? Math.round(parseInt(studentScore[0].count + studnetScore2[0].count) * parseFloat(questionType[0].mark)) : parseInt(studentScore[0].count + studnetScore2[0].count) * parseFloat(questionType[0].mark);
        res.json(
          studentTotalScore
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

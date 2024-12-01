import prisma from "../../../../../core/db/prismaInstance.js";

export default async function dashboard(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const examParticipationCounts = await prisma.$queryRaw`
        SELECT COUNT(*) as student_count
        FROM student_exam
        WHERE exam_id = ${examId}
        GROUP BY exam_id;
    `;
    const examMin = await prisma.$queryRaw`
        SELECT MIN(total_score) AS minScore 
        FROM student_exam
        WHERE exam_id = ${examId}
    `;
    const examMax = await prisma.$queryRaw`
        SELECT MAX(total_score) AS maxScore 
        FROM student_exam
        WHERE exam_id = ${examId}
    `;
    const examAverage = await prisma.$queryRaw`
        SELECT AVG(total_score) AS avgScore 
        FROM student_exam
        WHERE exam_id = ${examId}
    `;
    const passMark = await prisma.$queryRaw`
        SELECT pass_mark 
        FROM exam
        WHERE id = ${examId}
    `;
    const examPass = await prisma.$queryRaw`
        SELECT COUNT(*) as passAmount
        FROM student_exam
        WHERE total_score >= ${passMark[0].pass_mark}
    `;
    const mostIncorrectQuestion = await prisma.$queryRaw`
      SELECT question_id, COUNT(DISTINCT student_id) AS incorrect
      FROM student_answer
      WHERE ans_correct = false
      GROUP BY question_id
      ORDER BY incorrect DESC
      ;
    `;

    const incorrectQuestionIDs = mostIncorrectQuestion.map((item) =>
      Number(item.question_id)
    );

    const mostIncorrectQuestionData = await prisma.$queryRaw`
      SELECT eq.id,eq.title,eq.type,ec.choice_text
      FROM exam_question AS eq, exam_choice AS ec
      WHERE eq.id=ec.question_id
      AND eq.id = ANY (${incorrectQuestionIDs})
    `;
    const groupedData = mostIncorrectQuestionData.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = {
          id: item.id,
          title: item.title,
          type: item.type,
          choice_text: [],
        };
      }
      acc[item.id].choice_text.push(Number(item.choice_text));
      return acc;
    }, {});
    const groupedDataArr = Object.values(groupedData);

    res.status(200).json({
      data: {
        participant: parseInt(examParticipationCounts[0].student_count),
        min: examMin[0].minscore,
        max: examMax[0].maxscore,
        avg: examAverage[0].avgscore,
        pass: parseInt(examPass[0].passamount),
        fail:
          parseInt(examParticipationCounts[0].student_count) -
          parseInt(examPass[0].passamount),
        mostIncorrectQuestion: groupedDataArr,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

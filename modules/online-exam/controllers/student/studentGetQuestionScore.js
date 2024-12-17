import prisma from "../../../../core/db/prismaInstance.js";

const studentGetQuestionScore = async (req, res) => {
  const questionId = parseInt(req.query.questionId);
  try {
    const questionType =
      await prisma.$queryRaw`SELECT type FROM exam_question WHERE id = ${questionId}`;
    if (questionType[0].type == "Essay") {
      const essayScore =
        await prisma.$queryRaw`SELECT mark FROM exam_question WHERE id = ${questionId}`;
      const maxScore = parseFloat(essayScore[0].mark);
      res.json(maxScore);
    } else if (questionType[0].type == "Checklist") {
      const checklistScore =
        await prisma.$queryRaw`SELECT eq.mark, count(*), eq.id FROM exam_question AS eq, exam_choice AS ec WHERE eq.id = ec.question_id AND eq.id = ${questionId} GROUP BY eq.id`;
      const maxScore =
        parseInt(checklistScore[0].count) % 2 === 0
          ? parseFloat(checklistScore[0].mark) *
            parseFloat(checklistScore[0].count)
          : Math.round(
              parseFloat(checklistScore[0].mark) *
                parseFloat(checklistScore[0].count)
            );
      res.json(maxScore);
    } else {
      const multipleChoiceScore =
        await prisma.$queryRaw`SELECT mark FROM exam_question WHERE id = ${questionId} AND type = 'Multiple Choice'`;
      res.json(parseFloat(multipleChoiceScore[0].mark));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export default studentGetQuestionScore;

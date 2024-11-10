import prisma from "../../../../../core/db/prismaInstance.js";

const getQuestionScore = async (req, res) => {
  const questionId = parseInt(req.query.id);
  try {
    const questionType = await prisma.$queryRaw`SELECT type FROM exam_question WHERE id = ${questionId}`;
    if (questionType[0].type == "Essay") {
        const essayScore = await prisma.$queryRaw`SELECT mark FROM exam_question WHERE id = ${questionId}`; 
        const maxScore = parseFloat(essayScore[0].mark);
        res.json(maxScore);
    } else{
        const multipleChoiceScore = await prisma.$queryRaw`SELECT exam_question.mark, COUNT(exam_choice.question_id) FROM exam_question, exam_choice WHERE exam_question.id = exam_choice.question_id AND exam_question.id = ${questionId} AND exam_choice.correct_ans = true GROUP BY exam_question.mark`;
        const maxScore = parseFloat(multipleChoiceScore[0].mark) * parseFloat(multipleChoiceScore[0].count);
        res.json(maxScore);
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

export default getQuestionScore;
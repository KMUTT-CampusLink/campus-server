import prisma from "../../../../../core/db/prismaInstance.js";

import { decryptPin } from "../../../utils/crypto.js";

export default async function getExamDataById(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const queryExam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
    });
    const queryQuestion = await prisma.exam_question.findMany({
      where: {
        exam_id: examId,
      },
      orderBy: {
        id: "asc",
      },
    });
    const questionIds = queryQuestion.map((question) => question.id);
    const queryChoice = await prisma.exam_choice.findMany({
      where: {
        question_id: { in: questionIds },
      },
      orderBy: {
        id: "asc",
      },
    });
    let pin = null;
    if (queryExam.pin !== null) {
      pin = decryptPin(queryExam.pin, queryExam.vi);
    }
    res.status(200).json({
      data: {
        pin: pin,
        exam: queryExam,
        questions: queryQuestion,
        choices: queryChoice,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

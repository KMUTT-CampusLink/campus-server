import prisma from "../../../../../core/db/prismaInstance.js";

import { decodeToken } from "../../../middleware/jwt.js";

export default async function createExam(req, res) {
  const title = req.body.exam.title;
  const description = req.body.exam.description;
  const sectionId = parseInt(req.body.sectionId);
  const token = req.cookies.token;
  const exam = req.body.exam;
  try {
    const decoded = decodeToken(token);
    const userId = decoded.id;
    const  queryProfessorData = await prisma.$queryRaw`SELECT e.id FROM professor AS p, employee AS e WHERE e.user_id= ${userId}::uuid AND e.id = p.emp_id AND p.section_id = ${sectionId}`;
    const totalScore = exam.questions.map((question) => parseInt(question.score)).reduce((a, b) => a + b, 0);
    console.log(queryProfessorData);
    const queryExamRaw = await prisma.exam.create({
      data: {
        title: title,
        description: description,
        professor_id: queryProfessorData[0].id,
        section_id: sectionId,
        full_mark: totalScore
      },
      select: {
        id: true
      }
    });
    const examId = queryExamRaw.id;
    for (const [index, question] of exam.questions.entries()) {
      let score = question.score;
      if (question.type === "Checklist"){
          score = question.score / question.options.length;
      }
      const queryQuestionRaw = await prisma.$queryRaw`INSERT INTO "exam_question" ("exam_id", "type", "title", "mark") 
                                                      VALUES (${examId}, ${question.type}::question_type_enum, ${question.questionText}, ${score}) 
                                                      RETURNING id`;
      const questionId = queryQuestionRaw[0].id;
      if ( question.type === "Multiple Choice" || question.type === "Checklist" ) {
        for (let i = 0;i < question.options.length;i++) {
          const isCorrect = (question.answer || []).includes(question.options[i]);
          await prisma.exam_choice.create({
            data: {
              question_id: questionId,
              choice_text: question.options[i],
              correct_ans: isCorrect
            }
          });          
        }
      }
    }
    res.status(200).json({ message: "Exam created successfully", data: examId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

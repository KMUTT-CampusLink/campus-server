import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function getStudentReview(req, res) {
  const examId = parseInt(req.query.examId);
  const token = req.cookies.token;

  try {
    if (isNaN(examId)) throw "Missing Required Parameters";

    const decoded = decodeToken(token);
    const userId = decoded.id;

    // Get student ID with explicit type casting
    const studentQuery = await prisma.$queryRaw`SELECT id FROM student WHERE user_id = ${userId}::uuid`;
    if (!studentQuery.length) throw new Error("Student not found");

    const studentId = studentQuery[0].id;

    // Fetch student answers
    const studentAns = await prisma.exam_question.findMany({
      where: {
        exam_id: examId,
      },
      select: {
        type: true,
        title: true,
        question_img: true,
        id:true,
        exam_choice: {
          select: {
            choice_text: true,
            choice_img: true,
          },
        },
        student_answer: {
          where: {
            student_id: studentId,
          },
          select: {
            answer: true,
          },
        },
      },
    });

    return res.status(200).json(studentAns);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}

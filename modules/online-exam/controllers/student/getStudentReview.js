import prisma from "../../../../core/db/prismaInstance.js";

export default async function getStudentReview(req, res) {
  try {
    const examId = parseInt(req.query.examId);
    if (isNaN(examId)) throw "Missing Required Parameters";
    const studentId = "66130500850";
    const studentAns = await prisma.exam_question.findMany({
      where: {
        exam_id: examId,
      },
      select: {
        type: true,
        title: true,
        question_img: true,
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

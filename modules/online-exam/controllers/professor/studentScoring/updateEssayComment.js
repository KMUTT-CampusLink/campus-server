import prisma from "../../../../../core/db/prismaInstance.js";

export default async function updateEssayComment(req, res) {
  const studentExamId = parseInt(req.body.studentExamId); // This isn't directly used here
  const studentId = req.body.studentId;
  const essayComments = req.body.finalEssayComments; // Expecting this to be an array of objects: { question_id, comment }
console.log(essayComments)
  try {
    await Promise.all(
      essayComments.map(async (comment) => {
        await prisma.$queryRaw`UPDATE student_answer SET essay_comment = ${comment.comment} WHERE student_id = ${studentId} AND question_id = ${comment.question_id}`;
      })
    );

    return res.status(200).json({ message: "Essay comments updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

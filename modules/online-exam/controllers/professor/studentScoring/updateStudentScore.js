import prisma from "../../../../../core/db/prismaInstance.js";

export default async function updateStudentScore(req, res) {
  const id = parseInt(req.body.studentExamId);
  const studentId = req.body.studentId;
  const finalEssayScore = req.body.finalEssayScore.scoring;
  const finalComment = req.body.finalComment.comment;
  try {
    await Promise.all(
      finalEssayScore.map(async (score) => {
        await prisma.$queryRaw`UPDATE student_answer SET essay_score = ${parseFloat(
            score.score
        )} WHERE student_id = ${studentId} AND question_id = ${score.question_id}`;
      })
    );
    await Promise.all(
      finalComment.map(async (comment) => {
        await prisma.$queryRaw`UPDATE student_answer SET essay_comment = ${comment.comment} WHERE student_id = ${studentId} AND question_id = ${comment.question_id}`;
      })
    );
    let score = 0;
    for (let i = 0;i < finalEssayScore.length;i++) {
        score += finalEssayScore[i].score;
    }
    const studentScore = await prisma.$queryRaw`SELECT total_score FROM student_exam WHERE id = ${id}`;
    const newStudentScore = parseFloat(studentScore[0].total_score) + parseFloat(score);
    await prisma.$queryRaw`UPDATE student_exam SET total_score = ${parseFloat(newStudentScore)}, is_checked = true WHERE id = ${id}`;
    const sectionId = await prisma.$queryRaw`SELECT e.section_id FROM exam AS e, student_exam AS se WHERE se.id = ${id} AND e.id = se.exam_id`;
    return res.status(200).json({ message: "Student score updated", data: sectionId[0].section_id});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

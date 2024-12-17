import prisma from "../../../../../core/db/prismaInstance.js";

export default async function checkHasParticipant(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const examParticipationCounts = await prisma.$queryRaw`
            SELECT COUNT(*) as student_count
            FROM student_exam
            WHERE exam_id = ${examId}
            GROUP BY exam_id;
        `;
    if (examParticipationCounts.length > 0) {
      return res.status(200).json({ hasParticipant: true });
    }
    return res.status(200).json({ hasParticipant: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

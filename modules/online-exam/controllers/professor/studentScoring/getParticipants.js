import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getParticipants(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const queryStudentExam = await prisma.$queryRaw`SELECT se.id, se.student_id, se.total_score, se.is_checked, s.firstname, s.lastname FROM student_exam AS se, student AS s WHERE se.exam_id = ${examId} AND se.student_id = s.id`;
    const queryExam = await prisma.exam.findUnique({
        where: {
            id: examId,
        },
        select: {
            pass_mark: true,
            full_mark: true,
        },
    });
    res.status(200).json({
        data: queryStudentExam,
        pass_mark: queryExam.pass_mark,
        full_mark: queryExam.full_mark,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

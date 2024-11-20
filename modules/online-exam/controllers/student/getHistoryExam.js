import prisma from "../../../../core/db/prismaInstance.js";

import { decodeToken } from "../../middleware/jwt.js";

export default async function getHistoryExam(req, res) {
  const token = req.cookies.token;
  const sectionId = parseInt(req.query.sectionid);
  try {
    const decoded = decodeToken(token);
    const userId = decoded.id;
    const queryStudentId = await prisma.$queryRaw`SELECT id FROM student WHERE user_id = ${userId}::uuid`;
    const queryStudent = await prisma.$queryRaw`SELECT se.exam_id FROM student_exam AS se, exam AS e, student AS s WHERE s.user_id = ${userId}::uuid AND s.id = se.student_id AND e.id = se.exam_id AND se.student_id = ${queryStudentId[0].id} AND se.status = 'Completed' AND (e.is_publish_immediately = true OR e.publish_score_status = true) AND e.section_id = ${sectionId}`;
    const examIds = queryStudent.map((exam) => exam.exam_id);
    const queryExam = await prisma.exam.findMany({
      where: {
        id: { in: examIds },
      },
      select: {
        id: true,
        title: true,
      },
    });
    return res
      .status(200)
      .json({ message: "All exams fetched", data: queryExam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
import prisma from "../../../../core/db/prismaInstance.js";

import { decodeToken } from "../../middleware/jwt.js";

export default async function getHistoryExam(req, res) {
  const token = req.cookies.token;
  const sectionId = parseInt(req.query.sectionid);
  try {
    const decoded = decodeToken(token);
    const userId = decoded.id;

    const queryStudentId = await prisma.$queryRaw`
    SELECT id 
    FROM student 
    WHERE user_id = ${userId}::uuid`;

    const queryStudent = await prisma.$queryRaw`
    SELECT DISTINCT se.exam_id 
    FROM student_exam AS se, exam AS e, student AS s
    WHERE s.user_id = ${userId}::uuid 
    AND s.id = se.student_id 
    AND e.id = se.exam_id
    AND se.student_id = ${queryStudentId[0].id} 
    AND e.section_id = ${sectionId}
    AND (se.is_checked = true OR (se.exam_id NOT IN (SELECT exam_id 
                                                     FROM exam_question 
                                                     WHERE type = 'Multiple Choice')))`;
    console.log(queryStudent);
    const examIds = queryStudent.map((exam) => exam.exam_id);
    if (examIds.length < 1) {
      return res.status(404).json({ message: "No exam found" });
    }
    const examIdsList = `(${examIds.join(",")})`;
    const queryExam = await prisma.$queryRawUnsafe(`
      SELECT se.id AS studentExamId, e.id, e.title, se.student_id 
      FROM exam AS e, student_exam AS se 
      WHERE e.id = se.exam_id 
      AND e.id IN ${examIdsList}
      AND se.student_id = '${queryStudentId[0].id}'
      `);
    return res
      .status(200)
      .json({ message: "All exams fetched", data: queryExam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

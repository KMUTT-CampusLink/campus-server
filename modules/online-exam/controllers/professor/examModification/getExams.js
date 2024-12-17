import prisma from "../../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../../middleware/jwt.js";

export default async function getExams(req, res) {
  const token = req.cookies.token;
  const sectionid = parseInt(req.query.sectionid);
  try {
    const decoded = decodeToken(token);
    const userId = decoded.empId;
    const queryProfessorData = await prisma.$queryRaw`
        SELECT p.section_id
        FROM professor AS p, employee AS e 
        WHERE e.id = ${userId}
        AND e.id = p.emp_id 
        AND p.section_id = ${sectionid}`;
    if (queryProfessorData.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this section" });
    }
    const exams = await prisma.$queryRaw`
        SELECT id, title, description, publish_status, start_date, end_date
        FROM exam 
        WHERE section_id = ${sectionid} AND end_date > NOW()`;
    const historyExams = await prisma.$queryRaw`
        SELECT id, title, description, publish_status, end_date
        FROM exam 
        WHERE section_id = ${sectionid} AND end_date < NOW()`;
    const course =
      await prisma.$queryRaw`SELECT c.name FROM course AS c, section AS s WHERE s.id = ${sectionid} AND s.course_code = c.code`;
    const section = await prisma.$queryRaw`
      SELECT is_grading_expand,grade_announce_status
      FROM section
      WHERE id = ${sectionid}`;
    return res.json({
      courseTitle: course,
      exam: exams,
      historyExam: historyExams,
      section: section,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

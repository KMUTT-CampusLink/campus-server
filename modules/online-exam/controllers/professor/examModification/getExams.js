import prisma from "../../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../../middleware/jwt.js";

export default async function getExams(req, res) {
  const token = req.cookies.token;
  const sectionid = parseInt(req.query.sectionid);

  try {
    const decoded = decodeToken(token);
    console.log(decoded)
    const userId = decoded.id;
    
    const queryProfessorData =
      await prisma.$queryRaw`SELECT p.id FROM professor AS p, employee AS e WHERE e.id = p.emp_id AND e.user_id = ${userId}::uuid AND p.section_id = ${sectionid}`;
    const exams =
      await prisma.$queryRaw`SELECT id, title, description FROM exam WHERE professor_id = ${queryProfessorData[0].id} AND section_id = ${sectionid}`;

    return res.json(exams);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

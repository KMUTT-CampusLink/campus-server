import prisma from "../../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../../middleware/jwt.js";

export default async function getExams(req, res) {
    const token = req.cookies.token;
    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;
        const queryProfessorData = await prisma.$queryRaw`SELECT p.section_id, p.id FROM professor AS p, employee AS e WHERE e.id = p.emp_id AND e.user_id = ${userId}::uuid`;
        const exams = await prisma.$queryRaw`SELECT id, title, description FROM exam WHERE professor_id = ${queryProfessorData[0].id} AND section_id = ${parseInt(queryProfessorData[0].section_id)}`;      
        return res.json(exams);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

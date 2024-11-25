import prisma from "../../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../../middleware/jwt.js";

export default async function getExams(req, res) {
    const token = req.cookies.token;
    const sectionid = parseInt(req.query.sectionid);
    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;
        const  queryProfessorData = await prisma.$queryRaw`
        SELECT  p.emp_id,  p.section_id
        FROM professor AS p, employee AS e 
        WHERE e.user_id= ${userId}::uuid 
        AND e.id = p.emp_id 
        AND p.section_id = ${sectionid}`;
        console.log(queryProfessorData)
        if (queryProfessorData.length === 0) {
            return res.status(403).json({ message: "You are not authorized to access this section" });
        }
        const exams = await prisma.$queryRaw`
        SELECT id, title, description 
        FROM exam 
        WHERE section_id = ${sectionid}`;  // remove professor_id = ${queryProfessorData[0].id} bc 1 course can have multiple professors
        const course = await prisma.$queryRaw`SELECT c.name FROM course AS c, section AS s WHERE s.id = ${sectionid} AND s.course_code = c.code`;
        return res.json({courseTitle: course, exam: exams});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

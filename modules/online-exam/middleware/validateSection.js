import prisma from "../../../core/db/prismaInstance.js";

import { decodeToken } from "./jwt.js";

export default async function validateSection(req, res) {
    const token = req.cookies.token;
    const sectionId = parseInt(req.query.sectionId);
    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;
        const role = decoded.role;
        let query;
        if (role === "Student"){
            query = await prisma.$queryRaw`SELECT ed.section_id FROM student AS s, enrollment_detail as ed WHERE s.user_id = ${userId}::uuid AND s.id = ed.student_id AND ed.section_id = ${sectionId}`;
        }
        if (role === "Professor"){
            query = await prisma.$queryRaw`SELECT p.section_id FROM employee AS e, professor AS p WHERE e.user_id = ${userId}::uuid AND e.id = p.emp_id AND p.section_id = ${sectionId}`;
        }
        return res.json({status: query.length > 0});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
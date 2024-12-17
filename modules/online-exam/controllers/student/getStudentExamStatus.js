import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function getStudentExamStatus(req, res) {
    const examId = parseInt(req.query.examId);
    const token = req.cookies.token;
    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;
        const studentQuery = await prisma.$queryRaw`SELECT id FROM student WHERE user_id = ${userId}::uuid`;
        const queryStudentExam = await prisma.$queryRaw`SELECT status FROM student_exam WHERE exam_id = ${examId} AND student_id = ${studentQuery[0].id}`;
        const status = queryStudentExam.status === "Completed" ? true : false;
        return res.status(200).json({ message: "Student exam status fetched", data: status });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
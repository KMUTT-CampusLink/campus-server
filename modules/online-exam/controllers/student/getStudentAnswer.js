import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function getStudentAnswer(req, res) {
    const token = req.cookies.token;
    const examId = parseInt(req.query.examId);
    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;
        const studentQuery = await prisma.$queryRaw`SELECT id FROM student WHERE user_id = ${userId}`;
        const queryAnswer = await prisma.student_answer.findMany({
            where: {
                student_id: studentQuery.id,
                exam_id: examId,
            },
            select: {
                question_id: true,
                answer: true,
            },
        });
        return res.status(200).json({ message: "All answers fetched", data: queryAnswer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
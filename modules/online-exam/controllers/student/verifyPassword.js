import prisma from "../../../../core/db/prismaInstance.js"

import { decodeToken } from "../../middleware/jwt.js"
import { decryptPin } from "../../utils/crypto.js";

export default async function verifyPassword(req, res) {
    const password = req.body.password;
    const examId = parseInt(req.body.examId);
    const token = req.cookies.token;
    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;
        const queryStudent = await prisma.student.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                id: true,
            },
        });
        const queryExamRaw = await prisma.$queryRaw`SELECT pin, vi FROM exam WHERE id = ${examId}`;
        if (decryptPin(queryExamRaw[0].pin, queryExamRaw[0].vi) === password) {
            await prisma.student_exam.create({
                data: {
                    exam_id: examId,
                    student_id: queryStudent.id,
                    status: 'In_Progress',
                },
            });
            return res.status(200).json({ message: "Password is correct" });
        } else {
            return res.status(400).json({ message: "Password is incorrect" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
import prisma from "../../../../core/db/prismaInstance.js"

export default async function verifyPassword(req, res) {
    const password = parseInt(req.body.password);
    const examId = parseInt(req.body.examId);
    const studentId = "66130500849";
    try {
        const queryExamRaw = await prisma.$queryRaw`SELECT "pin" FROM "exam" WHERE id = ${examId}`;
        if (parseInt(queryExamRaw[0].pin) === password) {
            await prisma.student_exam.create({
                data: {
                    student_id: studentId,
                    exam_id: examId,
                },
            });
            await prisma.$queryRaw`UPDATE student_exam SET status = 'In Progress' WHERE student_id = ${studentId} AND exam_id = ${examId}`;
            return res.status(200).json({ message: "Password is correct" });
        } else {
            return res.status(400).json({ message: "Password is incorrect" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
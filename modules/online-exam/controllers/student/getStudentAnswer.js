import prisma from "../../../../core/db/prismaInstance.js";

export default async function getStudentAnswer(req, res) {
    const studentId = "66130500850";
    const examId = parseInt(req.query.examId);
    try {
        const queryAnswer = await prisma.student_answer.findMany({
            where: {
                student_id: studentId,
                exam_id: examId,
            },
            select: {
                question_id: true,
                answer: true,
            },
        });
        console.log(queryAnswer);
        return res.status(200).json({ message: "All answers fetched", data: queryAnswer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
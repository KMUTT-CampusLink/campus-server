import prisma from "../../../../core/db/prismaInstance.js";

export default async function getStudentExamStatus(req, res) {
    const examId = parseInt(req.query.examId);
    const studentId = "66130500850";
    try {
        const queryStudentExam = await prisma.student_exam.findFirst({
            where: {
                exam_id: examId,
                student_id: studentId
            },
            select: {
                status: true
            }
        });
        const status = queryStudentExam.status === "Completed" ? true : false;
        return res.status(200).json({ message: "Student exam status fetched", data: status });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
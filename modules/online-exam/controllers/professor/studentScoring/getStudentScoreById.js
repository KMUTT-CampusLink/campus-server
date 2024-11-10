import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getStudentScoreById(req, res) {
    const questionId = parseInt(req.query.id);
    const studentId = req.query.studentId;
    try {
        const questionType = await prisma.$queryRaw`SELECT type, mark FROM exam_question WHERE id = ${questionId}`;
        if (questionType[0].type != "Essay") {
            const studentScore = await prisma.$queryRaw`SELECT count(*) FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId} AND ans_correct = true`;
            res.json(parseInt(studentScore[0].count) * questionType[0].mark);
        } else {
            const studentScore = await prisma.$queryRaw`SELECT essay_score FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId}`;
            res.json(parseInt(studentScore[0].essay_score));
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
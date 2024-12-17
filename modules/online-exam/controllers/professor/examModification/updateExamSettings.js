import prisma from "../../../../../core/db/prismaInstance.js";

export default async function updateExamSettings(req, res) {
    const examId = parseInt(req.body.examId);
    const exam = req.body.exam;
    try {
        const updatedExam = await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                start_date: new Date(exam.start_date).toISOString(),
                end_date: new Date(exam.end_date).toISOString(),
                publish_status: exam.publish_status,
                view_history: exam.view_history,
                is_shuffle: exam.is_shuffle,
                pass_mark: parseInt(exam.pass_mark),
                pin: exam.pin,
                is_publish_immediately: exam.is_publish_immediately,
            },
        });

        return res.status(200).json({ success: true, data: updatedExam });
    } catch (error) {
        console.error("Error updating exam:", error);
        return res.status(500).json({ message: error.message });
    }
}

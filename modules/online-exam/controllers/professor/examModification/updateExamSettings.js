import prisma from "../../../../../core/db/prismaInstance.js";

import { encryptPin } from "../../../utils/crypto.js";

export default async function updateExamSettings(req, res) {
    const examId = parseInt(req.body.examId);
    const exam = req.body.exam;
    try {
        const pin = encryptPin(exam.pin);
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
                pin: pin.encryptedData,
                vi: pin.iv,
                is_publish_immediately: exam.is_publish_immediately,
                publish_score_status: exam.publish_score_status,
            },
            select: {
                section_id: true,
            }
        });

        return res.status(200).json({ success: true, data: updatedExam.section_id });
    } catch (error) {
        console.error("Error updating exam:", error);
        return res.status(500).json({ message: error.message });
    }
}

import prisma from "../../../../../core/db/prismaInstance.js";

export default async function updateExamAnnouncement(req, res) {
  const examId = parseInt(req.body.examId);
  const publicScoreStatus = req.body.publicScoreStatus;
  try {
    const updatedExam = await prisma.exam.update({
      where: {
        id: examId,
      },
      data: {
        publish_score_status: publicScoreStatus,
      },
    });

    return res.status(200).json({ success: true, data: updatedExam });
  } catch (error) {
    console.error("Error updating exam:", error);
    return res.status(500).json({ message: error.message });
  }
}

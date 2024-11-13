import prisma from "../../../../../core/db/prismaInstance.js";

export default async function updateExamAnnouncement(req, res) {
  const examId = parseInt(req.body.examId);
  const  publicScoreStatus  = req.body.publicScoreStatus; // Extract publish_score_status from the request body
    console.log(req.body)
  try {
    const updatedExam = await prisma.exam.update({
      where: {
        id: examId,
      },
      data: {
        publish_score_status: publicScoreStatus, // Update only the publish_score_status field
      },
    });

    return res.status(200).json({ success: true, data: updatedExam });
  } catch (error) {
    console.error("Error updating exam:", error);
    return res.status(500).json({ message: error.message });
  }
}

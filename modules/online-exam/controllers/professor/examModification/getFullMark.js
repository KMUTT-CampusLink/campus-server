import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getFullMark(req, res) {
  const examId = parseInt(req.query.examId);

  try {
    const queryFullMark = await prisma.exam_question.aggregate({
      where: {
        exam_id: examId,
      },
      _sum: {
        mark: true,
      },
    });
    const fullMark = queryFullMark._sum.mark || 0;
    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: { full_mark: fullMark },
    });
    res.status(200).json({
      success: true,
      fullMark: queryFullMark._sum.mark || 0, // Return the sum or 0 if null
    });
  } catch (error) {
    console.error("Error updating full mark:", error);
    return res.status(500).json({ error: "Failed to update full mark" });
  }
}

import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getFullMark(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const examQuery = await prisma.$queryRaw`SELECT full_mark FROM exam WHERE id = ${examId}`;
    res.status(200).json({
      success: true,
      fullMark: examQuery[0].full_mark || 0,
    });
  } catch (error) {
    console.error("Error updating full mark:", error);
    return res.status(500).json({ error: "Failed to update full mark" });
  }
}

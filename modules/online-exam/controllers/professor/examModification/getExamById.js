import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getExamById(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const queryExamRaw = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
    });
    res.send(queryExamRaw);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

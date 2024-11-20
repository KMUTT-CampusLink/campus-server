import prisma from "../../../../core/db/prismaInstance.js";

export default async function getStudentFullMark(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const queryFullMark = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      select: {
        full_mark: true,
      },
    });
    return res.status(200).json({ data: queryFullMark });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

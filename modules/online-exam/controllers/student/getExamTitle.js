import prisma from "../../../../core/db/prismaInstance.js";

export default async function getExamTitle(req, res) {
    const examId = parseInt(req.query.examId);
    try {
        const queryExam = await prisma.exam.findUnique({
          where: {
            id: examId,
          },
          select: {
            title: true,
            description: true,
          },
        });
        return res.status(200).json({ data: queryExam });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
      }
}
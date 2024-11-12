import prisma from "../../../../core/db/prismaInstance.js";

export default async function getExamTime(req, res) {
  const examId = parseInt(req.query.examId);
  try {
    const queryStudent = await prisma.exam.findFirst({
      where: {
        id: examId,
      },
      select: {
        end_date: true,
      },
    });
    const now = new Date();
    const remainingTime = Math.max(
      new Date(queryStudent.end_date) -
        new Date(new Date(now).getTime() + 25200000),
      0
    );

    return res
      .status(200)
      .json({ message: "Exam time fetched", data: remainingTime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

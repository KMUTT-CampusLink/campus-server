import prisma from "../../../../core/db/prismaInstance.js";

export default async function getAllExam(req, res) {
  const studentId = req.query.studentId;
  try {
    const queryStudent = await prisma.$queryRaw`SELECT exam_id FROM student_exam WHERE student_id = ${studentId}`;
    // const queryStudent = await prisma.$queryRaw`SELECT exam_id FROM student_exam WHERE student_id = ${studentId} AND status <> 'Completed'`;
    const examIds = queryStudent.map((exam) => exam.exam_id);
    const queryExam = await prisma.exam.findMany({
      where: {
        id: {in: examIds},
      },
      select: {
        id: true,
        title: true,
      },
    });
    return res.status(200).json({ message: "All exams fetched", data: queryExam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

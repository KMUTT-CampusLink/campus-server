import prisma from "../../../../core/db/prismaInstance.js";

export default async function getAllExam(req, res) {
  const studentId = "66130500849";
  const sectionId = parseInt(req.query.sectionId);
  try {
    const queryStudent = await prisma.$queryRaw`SELECT id FROM exam WHERE section_id = ${sectionId} AND publish_status = true AND id NOT IN (SELECT exam_id FROM student_exam WHERE student_id = ${studentId})`;
    const examIds = queryStudent.map((exam) => exam.id);
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

import prisma from "../../../../core/db/prismaInstance.js";

export default async function getHistoryExam(req, res) {
    const studentId = req.query.studentId;
    try {
      const queryStudent = await prisma.$queryRaw`SELECT student_exam.exam_id FROM student_exam, exam WHERE exam.id = student_exam.exam_id AND student_exam.student_id = ${studentId} AND student_exam.status = 'Completed' AND is_publish_immediately = true`;
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
  
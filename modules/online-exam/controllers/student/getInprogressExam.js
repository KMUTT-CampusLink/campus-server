import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function getInprogressExam(req, res) {
    const token = req.cookies.token;
    const sectionid = parseInt(req.query.sectionid);
    try {
      const decoded = decodeToken(token);
      const userId = decoded.id;
      const queryStudent = await prisma.student.findUnique({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
        },
      });
      const queryStudentExam = await prisma.$queryRaw`SELECT se.exam_id FROM student_exam AS se, exam AS e WHERE se.exam_id = e.id AND se.student_id = ${queryStudent.id} AND e.section_id = ${sectionid} AND se.status = 'In Progress'`;
      const examIds = queryStudentExam.map((exam) => exam.exam_id);
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
  
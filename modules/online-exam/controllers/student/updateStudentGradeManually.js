import e from "express";
import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function updateStudentGradeManually(req, res) {
  const token = req.cookies.token;
  const sectionid = parseInt(req.query.sectionid);

  try {
    const decoded = decodeToken(token);
    const id = decoded.id;

    // Find the student based on user ID
    const queryStudentData = await prisma.student.findUnique({
      where: {
        user_id: id,
      },
      select: {
        id: true,
      },
    });
    const querySection = await prisma.section.findUnique({
      where: {
        id: sectionid,
      },
      select: {
        is_grading_expand: true,
      },
    });

    // Fetch the current timestamp from the database
    const dbCurrentDate = await prisma.$queryRaw`
        SELECT NOW() AS current_date`;

    if (dbCurrentDate.length > 0) {
      const currentDate = new Date(dbCurrentDate[0].current_date); // Database server time

      const semesterEndDate = await prisma.$queryRaw`
        SELECT end_date
        FROM semester AS sem, section AS sec
        WHERE sem.id = sec.semester_id AND sec.id = ${sectionid}`;

      if (semesterEndDate.length > 0) {
        const endDate = new Date(semesterEndDate[0].end_date);
        const gradingDate = new Date(endDate);
        gradingDate.setDate(endDate.getDate() + 15);
console.log(gradingDate)
console.log(dbCurrentDate)
        // Check if the database current date is past the grading date
        if (currentDate < gradingDate) {
          return res.status(400).json({
            message: "Grading is not allowed before the grading date",
          });
        }
        if (!querySection.is_grading_expand && currentDate >= gradingDate) {
          // Fetch student exams and their scores
          const queryStudentExam = await prisma.$queryRaw`
              SELECT exam_id, total_score
              FROM student_exam, exam
              WHERE student_id = ${queryStudentData.id} 
              AND exam_id = exam.id 
              AND section_id = ${sectionid}`;

          // Fetch exam total full marks
          const queryExam = await prisma.$queryRaw`
              SELECT id, full_mark
              FROM exam
              WHERE section_id = ${sectionid}`;

          // Calculate total scores
          const studentTotalScore = queryStudentExam.reduce(
            (sum, exam) => sum + parseFloat(exam.total_score, 10),
            0
          );
          const examTotalScore = queryExam.reduce(
            (sum, exam) => sum + parseFloat(exam.full_mark, 10),
            0
          );

          // Calculate percentage and determine grade
          const percentage = (studentTotalScore / examTotalScore) * 100;

          let grade;
          if (percentage >= 86) grade = parseInt(1001);
          else if (percentage >= 80) grade = parseInt(1002);
          else if (percentage >= 76) grade = parseInt(1003);
          else if (percentage >= 70) grade = parseInt(1004);
          else if (percentage >= 60) grade = parseInt(1005);
          else if (percentage >= 56) grade = parseInt(1006);
          else if (percentage >= 50) grade = parseInt(1007);
          else grade = parseInt(1008);

          const updateEnrollment = await prisma.$queryRaw`
              UPDATE enrollment_detail
              SET grade_id = ${grade}
              WHERE student_id = ${queryStudentData.id}
              AND section_id = ${sectionid}
              AND NOT EXISTS (
                  SELECT 1 
                  FROM enrollment_detail 
                  WHERE student_id = ${queryStudentData.id} 
                  AND section_id = ${sectionid} 
                  AND status = 'Withdraw'
        )`;

          const updateSection = await prisma.$queryRaw`
              UPDATE section
              SET grade_announce_status = true
              WHERE id = ${sectionid}`;

          return res.status(200).json({
            message: "Grade calculated and updated successfully",
            studentTotalScore: studentTotalScore,
            examTotalScore: examTotalScore,
            grade: grade,
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

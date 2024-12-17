import prisma from "../../../../core/db/prismaInstance.js";

// Helper function to determine if a section should be processed
function shouldProcessSection(section, currentDate) {
  if (section.is_grading_expand) return false;

  const endDate = new Date(section.end_date);
  const gradingDate = new Date(endDate);
  gradingDate.setDate(endDate.getDate() + 15);

  return currentDate >= gradingDate;
}

// Helper function to calculate grades for students in a section
function calculateGrades(students, exams, sectionId) {
  const examData = exams.filter((exam) => exam.section_id === sectionId);
  const examTotalScore = examData.reduce(
    (sum, exam) => sum + parseFloat(exam.full_mark, 10),
    0
  );

  return students.map((student) => {
    const studentExams = student.studentExams;
    const studentTotalScore = studentExams.reduce(
      (sum, exam) => sum + parseFloat(exam.total_score, 10),
      0
    );

    const percentage = (studentTotalScore / examTotalScore) * 100;
    console.log("exam:",examData, "totalscore",examTotalScore)
    console.log(studentTotalScore,percentage)
    let grade;
    if (percentage >= 86) grade = 1001;
    else if (percentage >= 80) grade = 1002;
    else if (percentage >= 76) grade = 1003;
    else if (percentage >= 70) grade = 1004;
    else if (percentage >= 60) grade = 1005;
    else if (percentage >= 56) grade = 1006;
    else if (percentage >= 50) grade = 1007;
    else grade = 1008;
    console.log(grade)
    return {
      student_id: student.id,
      section_id: sectionId,
      grade_id: grade,
    };
  });
}

async function updateStudentGrade() {
  try {
    // Fetch all sections and semester end dates
    const sections = await prisma.$queryRaw`
      SELECT sec.id, sec.is_grading_expand, sem.end_date
      FROM section sec
      JOIN semester sem ON sec.semester_id = sem.id
    `;

    // Fetch all exams in one query


    // Fetch the current database time
    const dbCurrentDate = await prisma.$queryRaw`SELECT NOW() AS current_date`;
    const currentDate = new Date(dbCurrentDate[0].current_date);

    for (const section of sections) {
      if (!shouldProcessSection(section, currentDate)) continue;
      const studentExams = await prisma.$queryRaw`
      SELECT student_id, exam_id, total_score, section_id
      FROM student_exam, exam
      WHERE student_exam.exam_id = exam.id
    `;
      // Get students and their exams for this section
      const students = studentExams
        .filter((exam) => exam.section_id === section.id)
        .reduce((acc, exam) => {
          acc[exam.student_id] = acc[exam.student_id] || {
            id: exam.student_id,
            studentExams: [],
          };
          acc[exam.student_id].studentExams.push(exam);
          return acc;
        }, {});

        const exams = await prisma.$queryRaw`
        SELECT id, full_mark, section_id
        FROM exam
        WHERE section_id = ${section.id}
      `;
      const grades = calculateGrades(
        Object.values(students),
        exams,
        section.id
      );
      console.log(exams)

        // Bulk update grades
        await prisma.$transaction(
          grades.map((grade) =>
            prisma.enrollment_detail.updateMany({
              where: {
                student_id: grade.student_id,
                section_id: grade.section_id,
                status: { not: "Withdraw" },
              },
              data: { grade_id: grade.grade_id },
            })
          )
        );

        // Update section to indicate grades are announced
        await prisma.section.update({
          where: { id: section.id },
          data: { grade_announce_status: true },
        });
    }

    console.log("Grades updated successfully!");
  } catch (error) {
    console.error("Error updating grades:", error);
  }
}
// run manually using node updateStudentGrade.js
(async () => {
  console.log("Testing the updateStudentGrade function...");
  try {
    await updateStudentGrade();
    console.log("Function executed successfully.");
  } catch (error) {
    console.error(
      "Error testing updateStudentGrade:",
      error.stack || error.message || error
    );
  }
})();

import prisma from "../../../../core/db/prismaInstance.js";

export default async function updateStudentGradeManually(req, res) {
  const sectionId = parseInt(req.body.sectionId);

  try {
    // Validate sectionId
    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required." });
    }

    // Fetch the current timestamp from the database
    const dbCurrentDate = await prisma.$queryRaw`
      SELECT NOW() AS current_date`;

    if (dbCurrentDate.length === 0) {
      return res.status(500).json({ message: "Unable to fetch database time." });
    }
    const currentDate = new Date(dbCurrentDate[0].current_date);

    // Fetch the semester's end date and calculate the grading date
    const semesterEndDate = await prisma.$queryRaw`
      SELECT end_date
      FROM semester AS sem, section AS sec
      WHERE sem.id = sec.semester_id AND sec.id = ${sectionId}`;

    if (semesterEndDate.length === 0) {
      return res.status(400).json({ message: "Invalid section or semester not found." });
    }

    const endDate = new Date(semesterEndDate[0].end_date);
    const gradingDate = new Date(endDate);
    gradingDate.setDate(endDate.getDate() + 15);

    // Check if grading is allowed
    if (currentDate < gradingDate) {
      return res.status(400).json({
        message: "Grading is not allowed before the grading date.",
      });
    }

    // Check if grading expansion is enabled
    const querySection = await prisma.section.findUnique({
      where: { id: sectionId },
      select: { is_grading_expand: true },
    });

    if (!querySection.is_grading_expand) {
      return res.status(400).json({
        message: "Grading expansion is not enabled for this section.",
      });
    }

    // Fetch all students enrolled in the section
    const enrolledStudents = await prisma.$queryRaw`
      SELECT student_id
      FROM enrollment_detail
      WHERE section_id = ${sectionId} AND status != 'Withdraw'`;

    if (enrolledStudents.length === 0) {
      return res.status(404).json({
        message: "No enrolled students found for this section.",
      });
    }

    // Fetch exams for the section
    const exams = await prisma.$queryRaw`
      SELECT id, full_mark
      FROM exam
      WHERE section_id = ${sectionId}`;

    if (exams.length === 0) {
      return res.status(404).json({
        message: "No exams found for this section.",
      });
    }

    const examTotalScore = exams.reduce(
      (sum, exam) => sum + parseFloat(exam.full_mark, 10),
      0
    );

    // Calculate and update grades for all enrolled students
    for (const student of enrolledStudents) {
      const studentExams = await prisma.$queryRaw`
        SELECT total_score
        FROM student_exam, exam
        WHERE student_id = ${student.student_id} 
        AND exam_id = exam.id
        AND section_id = ${sectionId}`;

      const studentTotalScore = studentExams.reduce(
        (sum, exam) => sum + parseFloat(exam.total_score, 10),
        0
      );

      const percentage = (studentTotalScore / examTotalScore) * 100;

      let grade;
      if (percentage >= 86) grade = 1001;
      else if (percentage >= 80) grade = 1002;
      else if (percentage >= 76) grade = 1003;
      else if (percentage >= 70) grade = 1004;
      else if (percentage >= 60) grade = 1005;
      else if (percentage >= 56) grade = 1006;
      else if (percentage >= 50) grade = 1007;
      else grade = 1008;

      // Update the grade for the student
      await prisma.$queryRaw`
        UPDATE enrollment_detail
        SET grade_id = ${grade}
        WHERE student_id = ${student.student_id} AND section_id = ${sectionId}`;
    }

    // Update the section grade announcement status
    await prisma.$queryRaw`
      UPDATE section
      SET grade_announce_status = true
      WHERE id = ${sectionId}`;

    return res.status(200).json({
      message: "Grades calculated and updated successfully for all students.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

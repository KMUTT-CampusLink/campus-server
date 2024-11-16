import prisma from "../../../core/db/prismaInstance.js";

export async function getGPAXByStudentId(req, res) {
  const { studentId } = req.params;

  try {
    const enrollmentDetails = await prisma.$queryRaw`
      SELECT 
        ed.id,
        ed.student_id,
        ed.status,
        g.grade_letter,
        g.grade_point,
        g.grade_info,
        s.course_code,
        c.name AS course_name,
        c.credits,              
        eh.semester_id,
        sem.name AS semester_name,
        sem.start_date,
        sem.end_date
      FROM 
        enrollment_detail ed
      LEFT JOIN 
        grade g ON ed.grade_id = g.id
      LEFT JOIN 
        section s ON ed.section_id = s.id
      LEFT JOIN 
        course c ON s.course_code = c.code
      LEFT JOIN 
        enrollment_head eh ON ed.head_id = eh.id
      LEFT JOIN 
        semester sem ON eh.semester_id = sem.id
      WHERE 
        ed.student_id = ${studentId}
        AND ed.status = 'Complete';  -- Only include courses with status 'Complete'
    `;

    if (!enrollmentDetails) {
      return res.status(200).json([]);
    }
    const degreeCredits = await prisma.$queryRaw`
      SELECT 
        d.credits_prescribed
      FROM 
        student st
      LEFT JOIN 
        degree d ON st.degree_id = d.id
      WHERE 
        st.id = ${studentId};  -- Use studentId to filter for the specific student
    `;
    const creditsPrescribed = degreeCredits[0]?.credits_prescribed;

    const {
      gpa,
      totalPoints,
      totalCredits,
      totalCoursesRegistered,
      totalCreditsRegistered,
    } = calculateGPAX(enrollmentDetails);

    const courses = enrollmentDetails.map(
      ({ course_code, course_name, grade_letter, credits }) => ({
        course_code,
        course_name,
        grade_letter,
        credits,
      })
    );

    res.json({
      creditsPrescribed,
      gpa,
      totalPoints,
      totalCredits,
      totalCoursesRegistered,
      totalCreditsRegistered,
      courses
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}

export async function getGPAXBySemesterId(req, res) {
  const { studentId, semesterId } = req.params;

  try {
    const enrollmentDetails = await prisma.$queryRaw`
      SELECT 
        ed.id,
        ed.student_id,
        ed.status,
        g.grade_letter,
        g.grade_point,
        g.grade_info,
        s.course_code,
        c.name AS course_name,
        c.credits,              
        eh.semester_id,
        sem.name AS semester_name,
        sem.start_date,
        sem.end_date
      FROM 
        enrollment_detail ed
      LEFT JOIN 
        grade g ON ed.grade_id = g.id
      LEFT JOIN 
        section s ON ed.section_id = s.id
      LEFT JOIN 
        course c ON s.course_code = c.code
      LEFT JOIN 
        enrollment_head eh ON ed.head_id = eh.id
      LEFT JOIN 
        semester sem ON eh.semester_id = sem.id
      WHERE 
        ed.student_id = ${studentId}
        AND ed.status = 'Complete'  -- Only include courses with status 'Complete'
        AND eh.semester_id = ${Number(semesterId)};   -- Filter by semesterId
    `;

    if (!enrollmentDetails.length) {
      return res.status(200).json([]);
    }
    const {
      gpa,
      totalPoints,
      totalCredits,
      totalCoursesRegistered,
      totalCreditsRegistered,
    } = calculateGPAX(enrollmentDetails);

    const courses = enrollmentDetails.map(
      ({ course_code, course_name, grade_letter, credits }) => ({
        course_code,
        course_name,
        grade_letter,
        credits,
      })
    );

    res.json({
      gpa,
      totalPoints,
      totalCredits,
      totalCoursesRegistered,
      totalCreditsRegistered,
      courses,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}

function calculateGPAX(enrollmentDetails) {
  let totalPoints = 0;
  let totalCredits = 0;
  let totalCoursesRegistered = 0;
  let totalCreditsRegistered = 0;

  enrollmentDetails.forEach((detail) => {
    const { grade_letter, grade_point, credits } = detail;

    if (grade_letter !== "S" && grade_letter !== "U") {
      const point = parseFloat(grade_point) || 0;
      const credit = parseInt(credits) || 0;

      totalPoints += point * credit;
      totalCredits += credit;

      totalCoursesRegistered++;
    }
    totalCreditsRegistered += credits;
  });

  const gpa =
    totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return {
    gpa,
    totalPoints,
    totalCredits,
    totalCoursesRegistered,
    totalCreditsRegistered,
  };
}

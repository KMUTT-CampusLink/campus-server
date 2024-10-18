import prisma from "../../../core/db/prismaInstance.js";

export async function getTranscriptByStudentId(req, res) {
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
        c.name,
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
      ORDER BY s.course_code;
    `;

    if (!enrollmentDetails.length) {
      return res.status(404).json({ error: "Student data not found" });
    }

    const groupedBySemester = groupBySemester(enrollmentDetails);
    res.json(Object.values(groupedBySemester));
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}

export async function getTranscriptBySemesterId(req, res) {
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
        c.name,
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
        AND eh.semester_id = ${Number(semesterId)};   -- Filter by semesterId
    `;

    if (!enrollmentDetails.length) {
      return res.status(404).json({ error: "Student data not found" });
    }

    const groupedBySemester = groupBySemester(enrollmentDetails);
    res.json(Object.values(groupedBySemester));
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}

function groupBySemester(enrollmentDetails) {
  return enrollmentDetails.reduce((acc, detail) => {
    const semesterId = detail.semester_id;
    if (!acc[semesterId]) {
      acc[semesterId] = {
        semester_id: semesterId,
        semester_name: detail.semester_name,
        start_date: detail.start_date,
        end_date: detail.end_date,
        courses: [],
      };
    }

    acc[semesterId].courses.push({
      id: detail.id,
      student_id: detail.student_id,
      status: detail.status,
      grade_letter: detail.grade_letter,
      grade_info: detail.grade_info,
      course_code: detail.course_code,
      course_name: detail.name,
      credits: detail.credits,
    });

    return acc;
  }, {});
}

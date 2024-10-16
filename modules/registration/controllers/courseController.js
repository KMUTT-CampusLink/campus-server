import prisma from "../../../core/db/prismaInstance.js";

export const getCourseByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { code },
      include: {
        program: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course data:", error);
    res.status(500).json({ error: "Failed to fetch course data" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({});

    if (!courses.length) {
      return res.status(404).json({ error: "No courses found" });
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getSectionByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const sections = await prisma.$queryRaw`
    SELECT 
      s.id AS section_id,
      s.name AS section_name,
      s.day AS section_day,
      TO_CHAR(s.start_time, 'HH12:MI AM') AS start_time,
      TO_CHAR(s.end_time, 'HH12:MI AM') AS end_time, 
      c.code AS course_code,
      c.name AS course_name,
      s.seat_left AS seats_left,
      r.name AS room_name,
      STRING_AGG(CONCAT(e.firstname, ' ', e.lastname), ', ') AS professor_names
    FROM 
      section s
    JOIN 
      course c ON s.course_code = c.code
    LEFT JOIN 
      room r ON s.room_id = r.id
    LEFT JOIN 
      professor p ON s.id = p.section_id
    LEFT JOIN 
      employee e ON p.emp_id = e.id 
    WHERE 
      s.course_code ILIKE ${`%${code}%`}
    GROUP BY
      s.id, c.code, r.name;
  `;

    if (!sections.length) {
      return res.status(404).json({ error: "No courses found" });
    }

    res.json(sections);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const searchCourses = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { code: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        code: "asc",
      },
    });

    return res.json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export async function getActiveCoursesByStudentId(req, res) {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    const sections = await prisma.$queryRaw`
      SELECT 
        s.id AS section_id,
        s.name AS section_name,
        s.day AS section_day,
        TO_CHAR(s.start_time, 'HH12:MI AM') AS start_time,
        TO_CHAR(s.end_time, 'HH12:MI AM') AS end_time, 
        c.code AS course_code,
        c.name AS course_name,
        c.credits,
        r.name AS room_name,
        ed.id AS ed_id,
        STRING_AGG(CONCAT(e.firstname, ' ', e.lastname), ', ') AS professor_names
      FROM 
        section s
      JOIN 
        course c ON s.course_code = c.code
      LEFT JOIN 
        room r ON s.room_id = r.id
      LEFT JOIN 
        professor p ON s.id = p.section_id
      LEFT JOIN 
        employee e ON p.emp_id = e.id 
      LEFT JOIN 
        enrollment_detail ed ON s.id = ed.section_id AND ed.student_id = ${studentId} 
      WHERE 
        ed.status = 'Active' 
      GROUP BY
        s.id, c.code, ed.id, r.name;
    `;

    if (!sections.length) {
      return res.status(404).json({ error: "Course data not found" });
    }

    res.json(sections);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}

import prisma from "../../../core/db/prismaInstance.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.$queryRaw`
    SELECT code,
    c.name AS course_name, 
    p.name AS program_name, 
    credits,
    description 
    FROM course c, program p
    WHERE c.program_id = p.id`;
    if (!courses) {
      return res.status(404).json({ message: "No courses found" });
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getCourseByStudentID = async (req, res) => {
  try {
    const { studentID } = req.params;

    const courses = await prisma.$queryRaw`
      SELECT ed.section_id, c.code, c.name AS course_name
      FROM enrollment_detail ed, section s, course c
      WHERE ed.student_id = ${studentID} AND ed.status = 'Active'
      AND ed.section_id = s.id AND s.course_code = c.code`;

    if (!courses) {
      return res.status(200).json([]);
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllCoursesByStudentID = async (req, res) => {
  try {
    const { studentID } = req.params;

    const courses = await prisma.$queryRaw`
      SELECT ed.section_id, c.code, c.name AS course_name, c.description, sem.name as semester
      FROM enrollment_detail ed, section s, course c, semester sem
      WHERE ed.student_id = ${studentID}
      AND ed.section_id = s.id
      AND s.semester_id = sem.id
      AND s.course_code = c.code`;

    if (!courses) {
      return res.status(200).json([]);
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllCoursesByProfessorID = async (req, res) => {
  try {
    const { professorID } = req.params;

    const courses = await prisma.$queryRaw`
      SELECT s.id as sec_id, s.name as sec_name, c.code, c.name as course_name, sem.id as sem_id, sem.name as semester
      FROM professor p, section s, course c, semester sem
      WHERE p.emp_id = ${professorID}
      AND p.section_id = s.id 
      AND s.semester_id = sem.id
      AND s.course_code = c.code`;

    if (!courses) {
      return res.status(200).json([]);
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getCourseHeaderBySectionID = async (req, res) => {
  try {
    const { sectionID } = req.params;
    const intID = parseInt(sectionID, 10);
    const courses = await prisma.$queryRaw`
    SELECT s.id, s.course_code, c.name as course_name, concat(e.firstname, ' ', e.lastname ) as lecturer, c.description, concat(s.start_time, ' - ', s.end_time) as time
    FROM professor p, section s, employee e, course c
    WHERE s.id = ${intID} and
      s.course_code = c.code and
      s.id = p.section_id and
      p.emp_id = e.id
    `;

    if (!courses) return res.status(200).json([]);
    return res.status(200).json(courses[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
};

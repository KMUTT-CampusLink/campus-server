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
}

export const getCourseByStudentID = async (req, res) => {
  try {
    const { studentID } = req.params;

    const courses = await prisma.$queryRaw`
  SELECT ed.section_id, c.code, c.name AS course_name
  FROM enrollment_detail ed, section s, course c
  WHERE ed.student_id = ${studentID} AND ed.status = 'Active'
  AND ed.section_id = s.id AND s.course_code = c.code`;
    if (!courses) {
      return res.status(404).json({ message: "No courses found" });
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json(error);
  }
}
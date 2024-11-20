import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getAllStudentInSection(req, res) {
  const sectionId = parseInt(req.query.sectionid);
  try {
    const studentsInSection = await prisma.$queryRaw`
        SELECT COUNT(*) AS student_count
        FROM enrollment_detail
        WHERE section_id = ${sectionId}
        GROUP BY section_id;
        `;
    const studentCount = Number(studentsInSection[0]?.student_count);
    res.status(200).json({ data: studentCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

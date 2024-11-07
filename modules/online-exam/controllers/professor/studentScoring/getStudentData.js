import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getStudentData(req, res) {
  const id = parseInt(req.query.id);
  try {
    const studentData = await prisma.student_exam.findUnique({
      where: {
        id: id,
      },
      select: {
        is_checked: true,
      }
    });
    return res.status(200).json({
      data: studentData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

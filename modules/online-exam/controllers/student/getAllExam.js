import prisma from "../../../../core/db/prismaInstance.js";

export default async function getAllExam(req, res) {
  try {
    const queryExamRaw = await prisma.$queryRaw`SELECT * FROM "exam"`;
    return res.status(200).json({ message: "All exams fetched", data: queryExamRaw });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

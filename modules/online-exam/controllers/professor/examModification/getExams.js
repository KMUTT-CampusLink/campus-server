import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getExams(req, res) {
    try {
        const exams = await prisma.exam.findMany({
            select: {
              id: true,
              title: true,
              description: true
            }
          });          
        return res.json(exams);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

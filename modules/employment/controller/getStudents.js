import prisma from "../../../core/db/prismaInstance.js";

const getStudents = async (req, res) => {
  try {
    const student = await prisma.student.findMany({
      include: {
        degree: {
          select: {
            name: true,
          },
        },
      },

      orderBy: {
        id: "asc",
      },
    });

    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getStudents;

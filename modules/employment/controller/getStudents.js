import prisma from "../../../core/db/prismaInstance.js";

const getStudents = async (req, res) => {
  try {
    const student = await prisma.student.findMany({
      include: {
        uni_batch: {
          select: {
            batch_no: true,
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

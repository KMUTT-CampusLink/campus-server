import prisma from "../../../core/db/prismaInstance.js";

const getStudentsId = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const student = await prisma.student.findUnique({
      where: { id: id },
      include: {
        uni_batch: {
          select: {
            batch_no: true,
          },
        },
        program_batch: {
          select: {
            batch_no: true,
          },
        },
        degree: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getStudentsId;

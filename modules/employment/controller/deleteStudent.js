import prisma from "../../../core/db/prismaInstance.js";

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Student ID is required." });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    const userInfo = await prisma.student.findUnique({
      where: { id },
      select: {
        user_id: true,
        user: { select: { id: true } },
      },
    });

    await prisma.student.delete({
      where: { id },
    });

    await prisma.user.delete({
      where: { id: userInfo.user.id },
    });

    res.json({
      message: "Student and associated user deleted successfully",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteStudent;

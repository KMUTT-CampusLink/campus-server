import prisma from "../../../core/db/prismaInstance.js";

const deleteSection = async (req, res) => {
  const { code, id } = req.params;

  console.log(req.body);
  try {
    if (!code) {
      return res.status(400).json({ error: "Course Code is required." });
    }

    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    await prisma.section.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: "Course deleted successfully",
    });
    console.log("SUffecclul");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteSection;

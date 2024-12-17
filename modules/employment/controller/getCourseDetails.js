import prisma from "../../../core/db/prismaInstance.js";

const getCourseDetail = async (req, res) => {
  const { code } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { code: code },
    });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getCourseDetail;

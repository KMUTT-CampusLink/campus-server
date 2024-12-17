import prisma from "../../../core/db/prismaInstance.js";

const fetchCourseOnly = async (req, res) => {
  const { code } = req.params;
  try {
    const users = await prisma.course.findMany({
      where: { code },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default fetchCourseOnly;

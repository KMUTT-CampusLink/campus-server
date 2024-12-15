import prisma from "../../../core/db/prismaInstance.js";

const createCourse = async (req, res) => {
  const { name, program_id, description, objective } = req.body;

  try {
    const newCourse = await prisma.course.create({
      data: {
        name,
        program_id: parseInt(program_id),
        description,
        objective,
      },
    });
    res.json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createCourse;

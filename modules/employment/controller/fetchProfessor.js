import prisma from "../../../core/db/prismaInstance.js";

const fetchProfessor = async (req, res) => {
  try {
    const users = await prisma.employee.findMany({
      where: { job_title: "Professor" },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default fetchProfessor;

import prisma from "../../../core/db/prismaInstance.js";

const getAllUser = async (req, res) => {
    const user = req.user
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Users" });
  }
};

export { getAllUser };

import prisma from "../../../core/db/prismaInstance.js";

const getAllCategory = async (req, res) => {
  try {
    const cat = await prisma.category.findMany();
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Category" });
  }
};

export { getAllCategory };

import prisma from "../../../core/db/prismaInstance.js";
import { decodeToken } from "../middleware/jwt.js"

const getAllUser = async (req, res) => {
    const token = req.cookies.token;
    const decode = decodeToken(token);
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Users" });
  }
};

export { getAllUser };

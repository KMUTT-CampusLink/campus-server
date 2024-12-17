import prisma from "../../../core/db/prismaInstance.js";

const getUserRole = async (req, res) => {
  return res.status(200).json({ success: true });
};

export { getUserRole };

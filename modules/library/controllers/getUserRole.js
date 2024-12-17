import prisma from "../../../core/db/prismaInstance.js";

const getUserRole = async (req, res) => {
  const role = req.user.role; // Extract role from req.user

  if (role == "Staff") {
    return res.status(200).json({ success: true }); // Success if role is Staff
  } else {
    return res.status(200).json({ success: false }); // Fail otherwise
  }
};

export { getUserRole };

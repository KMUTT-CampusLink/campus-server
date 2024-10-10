import bcrypt from "bcrypt";
import prisma from "../db/prismaInstance.js";

export default async function activate(req, res) {
  const { campus_email, personal_email, password } = req.body;

  if (!campus_email || !personal_email || !password) {
    return res
      .status(400)
      .json({ msg: "campus_email, personal_email, and password required" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [{ campus_email }, { personal_email }],
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        msg: "User not found. Please contact admin for activation.",
      });
    }

    if (existingUser.is_activated) {
      return res.status(400).json({
        msg: "User already activated. Please contact admin if you need assistance.",
      });
    }

    // User exists and is not active, proceed with activation
    const hash = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        password: hash,
        is_activated: true,
      },
    });

    res.json({
      msg: "User activated successfully",
      user: {
        id: updatedUser.id,
        campus_email: updatedUser.campus_email,
        is_activated: updatedUser.is_activated,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error activating user", error: error.message });
  }
}

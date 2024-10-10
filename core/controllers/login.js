import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prismaInstance.js";

export default async function login(req, res) {
  const { campus_email, password } = req.body;

  if (!campus_email || !password) {
    return res.status(400).json({ msg: "campus_email and password required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { campus_email },
    });

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          campus_email: user.campus_email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 60 * 60 * 1000, // 3 hours
      });

      return res.json({
        conditio: "success",
        user: {
          id: user.id,
          campus_email: user.campus_email,
          is_activated: user.is_activated,
          role: user.role,
        },
        message: "Login successful",
      });
    }
    res.status(401).json({ msg: "Incorrect email or password" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../core/db/prismaInstance.js";

export default async function login(req, res) {
  const { campus_email, password } = req.body;

  if (!campus_email || !password) {
    return res.status(400).json({ msg: "campus_email and password required" });
  }

  try {
    // First, find the user by campus_email
    const user = await prisma.user.findUnique({
      where: { campus_email },
    });

    // If no user is found, return 401
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user.password == password) { // อย่าลืมคืนนน!! isPasswordValid
      // Find the student ID based on the user ID
      const student = await prisma.student.findUnique({
        where: { user_id: user.id },
        select: { id: true }, // Only select the student ID
      });

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: user.id,
          campus_email: user.campus_email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Secure cookies in production
        sameSite: "Strict", // SameSite protection
        maxAge: 3 * 60 * 60 * 1000, // 3 hours
      });

      // Return the user and student info
      return res.json({
        id: user.id,
        campus_email: user.campus_email,
        is_activated: user.is_activated,
        role: user.role,
        studentId: student ? student.id : null, // Include studentId if it exists
      });
    }

    // If password is incorrect, return 401
    return res.status(401).json({ msg: "Incorrect email or password" });
  } catch (error) {
    // Catch and handle server errors
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
}

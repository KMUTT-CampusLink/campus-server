import prisma from "../../../core/db/prismaInstance.js";

export const getNotifications = async (req, res) => {
  try {
    const userIdentifier = req.user?.id; // Replace with `req.user?.id` for real user
    console.log("User Identifier:", userIdentifier);

    const student = await prisma.student.findUnique({
      where: { user_id: userIdentifier },
      select: { id: true }, // Fetch only the student ID
    });

    const employee = await prisma.employee.findUnique({
      where: { user_id: userIdentifier },
      select: { id: true }, // Fetch only the employee ID
    });

    // Determine whether the user is a student or an employee
    const actualId = student?.id || employee?.id;

    if (!actualId) {
      return res.status(404).json({ success: false, message: "User not found in student or employee records" });
    }

    console.log("Actual Identifier (STU/EMP):", actualId);

    const notifications = await prisma.club_notification.findMany({
      where: {
        OR: [
          { stu_recipient: actualId },
          { stu_sender: actualId },
          { emp_recipient: actualId },
          { emp_sender: actualId },
        ],
      },
      select: {
        id: true,
        message: true,
        created_at: true,
        // stu_recipient: true,
        // stu_sender: true,
        // emp_recipient: true,
        // emp_sender: true,
      },
      orderBy: { created_at: "desc" },
    });

    console.log("Fetched Notifications:", notifications);

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

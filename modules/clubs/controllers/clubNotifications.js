import prisma from "../../../core/db/prismaInstance.js";

export const getNotifications = async (req, res) => {
  const { userType, clubId } = req.query;

  try {
    const whereCondition = {
      club_id: Number(clubId),
    };

    if (userType === "admin") {
      whereCondition.type = "Join Request"; // Admin notifications for join requests
    } else {
      whereCondition.recipient_id = req.user?.id || "STU00027"; // Replace with authenticated user's ID
    }

    const notifications = await prisma.club_notification.findMany({
      where: whereCondition,
      select: {
        id: true,
        message: true,
        created_at: true,
        type: true,
        sender_id: true,
        student_club_notification_sender_idTostudent: {
          select: { firstname: true, lastname: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};


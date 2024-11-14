import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await prisma.club_announcement.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            //announcement_img: true,
            club: {
            select: {
                name: true,
            },
            },
        },
        });
        return res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return res
        .status(500)
        .json({ success: false, message: "Failed to fetch announcements" });
    }
    };

// Get announcement by ClubID
export const getAnnouncementsByClubId = async (req, res) => {
  const { clubId } = req.params;

  try{
    const announcements = await prisma.club_announcement.findMany({
      where: {
        club_id: parseInt(clubId),
      },
      orderBy: { is_pinned: "desc"},
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        location: true,
        is_pinned: true,
        club: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch announcements" });
  }
};

export const createAnnouncement = async (req, res) => {
  const { announcementTitle, announcementContent, eventDate, eventTimeFrom, eventTimeTo, eventPlace } = req.body;
  const { clubId } = req.params;
  const memberId = 1028;

  const startDateTime = `${eventDate} ${eventTimeFrom}:00`;
  const endDateTime = `${eventDate} ${eventTimeTo}:00`;

  // Debugging logs
  console.log("Inserting DateTime as:", { startDateTime, endDateTime });

  console.log("Received data:", {
    announcementTitle,
    announcementContent,
    eventDate,
    eventPlace,
  });

  try {
    const newAnnouncement = await prisma.$executeRaw`
      INSERT INTO club_announcement (title, content, date, start_time, end_time, location, club_id, member_id)
      VALUES (${announcementTitle}, ${announcementContent}, ${eventDate}::date, ${startDateTime}::timestamp, ${endDateTime}::timestamp, ${eventPlace}, ${parseInt(clubId)}, ${memberId});
    `;
    return res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      data: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the announcement.",
      error: error.message,
    });
  }
};

// Toggle pin status for an announcement
export const toggleAnnouncementPin = async (req, res) => {
  const { id } = req.params;

  try {
      const announcement = await prisma.club_announcement.findUnique({
          where: { id: parseInt(id) },
      });

      if (!announcement) {
          return res.status(404).json({ success: false, message: "Announcement not found" });
      }

      const updatedAnnouncement = await prisma.club_announcement.update({
          where: { id: parseInt(id) },
          data: { is_pinned: !announcement.is_pinned },
      });

      return res.status(200).json({ success: true, data: updatedAnnouncement });
  } catch (error) {
      console.error("Error toggling announcement pin status:", error);
      return res.status(500).json({ success: false, message: "Failed to toggle announcement pin status" });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await prisma.club_announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    await prisma.club_announcement.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};
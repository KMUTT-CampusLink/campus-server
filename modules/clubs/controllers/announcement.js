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

// Create new announcement 
export const createAnnouncement = async (req, res) => {
    const { announcementTitle, announcementContent, eventDate, eventPlace } = req.body;
    const clubId = 1014; // Hardcoded for now
    const memberId = 1028; // Hardcoded for now
  
    try {
      const newAnnouncement = await prisma.club_announcement.create({
        data: {
          title: announcementTitle,
          content: announcementContent,
          date: eventDate,
          location: eventPlace,
          club_id: clubId,
          member_id: memberId,
        },
      });
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
  
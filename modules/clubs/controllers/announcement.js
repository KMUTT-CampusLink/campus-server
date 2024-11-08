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
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        location: true,
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

// // Create new announcement 
// export const createAnnouncement = async (req, res) => {
//   const { announcementTitle, announcementContent, eventDateTime, eventPlace } = req.body;
//   const { clubId } = req.params;
//   const memberId = 1028;

//   try {
//     const newAnnouncement = await prisma.club_announcement.create({
//       data: {
//         title: announcementTitle,
//         content: announcementContent,
//         date: new Date(eventDateTime), // Parse ISO-8601 format into Date object
//         location: eventPlace,
//         club_id: parseInt(clubId),
//         member_id: memberId,
//       },
//     });
//     return res.status(201).json({
//       success: true,
//       message: "Announcement created successfully.",
//       data: newAnnouncement,
//     });
//   } catch (error) {
//     console.error("Error creating announcement:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the announcement.",
//       error: error.message,
//     });
//   }
// };
export const createAnnouncement = async (req, res) => {
  const { announcementTitle, announcementContent, eventDateTime, eventPlace } = req.body;
  const { clubId } = req.params;
  const memberId = 1028;

  // Debugging logs
  console.log("Received data:", {
    announcementTitle,
    announcementContent,
    eventDateTime,
    eventPlace,
  });

  try {
    const newAnnouncement = await prisma.club_announcement.create({
      data: {
        title: announcementTitle,
        content: announcementContent,
        date: new Date(eventDateTime), // Ensure date parsing here
        location: eventPlace,
        club_id: parseInt(clubId),
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

  
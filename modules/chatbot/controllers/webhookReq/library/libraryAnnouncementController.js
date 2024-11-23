import prisma from "../../../../../core/db/prismaInstance.js";

export const libraryAnnouncementController = async (req, res) => {
  try {

    const announcements = await prisma.$queryRaw`
      SELECT title, location
      FROM "library_announcement"
      
    `;

   
    let fulfillment = "Here are the recent library announcements:\n";
    announcements.map((announcement, index) => {
      fulfillment += `${index + 1}. Title: ${announcement.title}\n   Location: ${announcement.location}\n `;
    });

    return res.json({ fulfillment });
  } catch (error) {
    console.error("Error fetching library announcements: " + error);
    res.status(500).json({ error: "Failed to fetch library announcements" });
  }
};

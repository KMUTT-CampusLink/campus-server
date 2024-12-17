import prisma from "../../../../../core/db/prismaInstance.js";

export const libraryAnnouncementController = async () => {
  try {

    const announcements = await prisma.$queryRaw`
      SELECT *
      FROM "library_announcement"
      WHERE date < CURRENT_DATE
    `;

    // console.log(announcements);
    if(!announcements || announcements.length === 0){
      return "There is no recent library events.";
    }
    let fulfillment = "Here are the recent library announcements:\n\n";
    announcements.map((announcement, index) => {
      fulfillment += `${index + 1}. Title: ${announcement.title}\t\t Location: ${announcement.location}\nDate: ${new Date(announcement.date).toLocaleDateString()}\t\t Period: ${announcement.duration}\nDescription: ${announcement.description}\n\n `;
    });
    return fulfillment;
  } catch (error) {
    console.error("Error fetching library announcements: " + error);
    // res.status(500).json({ error: "Failed to fetch library announcements" });
    return "Failed to fetch library announcements";
  } 
};

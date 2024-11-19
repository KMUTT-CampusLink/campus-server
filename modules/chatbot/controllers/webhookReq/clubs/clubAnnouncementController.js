import prisma from "../../../../../core/db/prismaInstance.js";

export const clubAnnouncementController = async (req, res) => {
    const{clubName}=req.query;
  try {

    const events = await prisma.$queryRaw`
      SELECT title, date,start_time,end_time,location
      FROM "club_announcement"as ca ,"club" as c
      where ca.id=c.id
      and c.name=${clubName}
      
    `;

   
    let fulfillment = `Here are the upcoming events for the " ${clubName} `;
    events.map((event, index) => {
      fulfillment += `${index + 1}. Title: ${event.title}\n   Location: ${event.location}  Start Time:${event.start_time} End Time:${event.end_time}\n `;
    });

    return res.json({ fulfillment });
  } catch (error) {
    console.error("Error fetching club announcements: " + error);
    res.status(500).json({ error: "Failed to fetch club announcements" });
  }
};

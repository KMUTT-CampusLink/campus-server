import prisma from "../../../../../core/db/prismaInstance.js";

export const clubAnnouncementController = async (clubName) => {
  try {
    const events = await prisma.$queryRaw`
      SELECT title, date,start_time,end_time,location
      FROM "club_announcement"as ca ,"club" as c
      where ca.id=c.id
      and c.name=${clubName}
    `;
    console.log(events);
    if(!events || events.length === 0){
      return `There is no event creted by ${clubName}.`
    }
    let fulfillment = `Here are the upcoming events for the "${clubName}."\n\n`;
    events.map((event, index) => {
      fulfillment += `${index + 1}. Title: ${event.title}\nLocation: ${event.location}\nStart Time: ${new Date(event.start_time).toLocaleDateString()} ${new Date(event.start_time).toLocaleTimeString()}\t\tEnd Time: ${new Date(event.end_time).toLocaleDateString()} ${new Date(event.end_time).toLocaleTimeString()}.\n\n`;
    });

    // return res.json({ fulfillment });
    return fulfillment;
  } catch (error) {
    console.error("Error fetching club announcements: " + error);
    // res.status(500).json({ error: "Failed to fetch club announcements" });
    return "Internal Server Error";
  }
};

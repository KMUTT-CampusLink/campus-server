import prisma from "../../../../../core/db/prismaInstance.js";

export const libraryEventController = async (req, res) => {
  try {
    const events = await prisma.$queryRaw`
      SELECT title, location, event_date 
      FROM "library_event" 
    `;
    let fulfillment = "Here are the upcoming library events:\n";
    events.map((event, index) => {
      fulfillment += `${index + 1}. Event: ${event.title}\n   Location: ${event.location}\n   Date: ${new Date(event.event_date).toLocaleDateString()}\n\n`;
    });

    return fulfillment;
  } catch (error) {
    console.error("Error fetching library events: " + error);
    return "Failed to fetch library events";
  }
};

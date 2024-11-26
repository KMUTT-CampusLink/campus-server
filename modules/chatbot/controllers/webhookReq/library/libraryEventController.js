import prisma from "../../../../../core/db/prismaInstance.js";

export const libraryEventController = async () => {
  try {
    const events = await prisma.$queryRaw`
      SELECT * 
      FROM "library_event"
      WHERE event_date >= CURRENT_DATE
    `;
    if(!events || events.length === 0){
      return "There is no upcoming event yet.";
    }
    let fulfillment = "Here are the upcoming library events:\n";
    events.map((event, index) => {
      fulfillment += `${index + 1}. Event: ${event.title}\t\tLocation: ${event.location}\t\tDate: ${new Date(event.event_date).toLocaleDateString()}\nDescription: ${event.description}\n\n`;
    });
    return fulfillment;
  } catch (error) {
    console.error("Error fetching library events: " + error);
    return "Failed to fetch library events";
  }
};

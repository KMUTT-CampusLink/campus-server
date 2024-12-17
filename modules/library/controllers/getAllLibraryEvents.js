import prisma from "../../../core/db/prismaInstance.js";

const getAllLibraryEvents = async (req, res) => {
  try {
    // Fetch current date
    const currentDate = new Date();

    // Fetch events where event_date is in the future
    const events = await prisma.library_event.findMany({
      where: {
        event_date: {
          gte: currentDate, // Only include events where event_date >= current date
        },
      },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching library events" });
  }
};

export { getAllLibraryEvents };

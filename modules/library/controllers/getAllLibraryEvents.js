import prisma from "../../../core/db/prismaInstance.js";

const getAllLibraryEvents = async (req, res) => {
  try {
    const events = await prisma.library_event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching library events" });
  }
};

export { getAllLibraryEvents };

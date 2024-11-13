import prisma from "../../../core/db/prismaInstance.js";

const getRoom = async (req, res) => {
  try {
    const events = await prisma.room.findMany();
    res.json(events);
  } catch (error) {
    console.error("Error fetching parking events:", error);
    res.status(500).json({ error: "Error fetching buildings events" });
  }
};

export { getRoom };

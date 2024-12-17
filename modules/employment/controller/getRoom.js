import prisma from "../../../core/db/prismaInstance.js";

const getRoom = async (req, res) => {
  try {
    const room = await prisma.room.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getRoom;

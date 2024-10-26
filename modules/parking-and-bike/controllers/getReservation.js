import prisma from "../../../core/db/prismaInstance.js";

const getReservation = async (req, res) => {
  try {
    const queryAllBuildings = await prisma.$queryRaw`
    SELECT *
    FROM "parking_building"
    `;

    const events = await prisma.parking_reservation.findMany();
    res.json(events);
  } catch (error) {
    console.error("Error fetching parking events:", error);
    res.status(500).json({ error: "Error fetching buildings events" });
  }
};

export { getReservation };

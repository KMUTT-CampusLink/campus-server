import prisma from "../../../core/db/prismaInstance.js";

const getEventReservations = async (req, res) => {
  const { library_event_id } = req.query;

  try {
    // Fetch reservations for a specific event
    const reservations = await prisma.library_event_reservation.findMany({
      where: { library_event_id: Number(library_event_id) },
      include: { user: true }, // Include user details if needed
    });

    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Error fetching reservations." });
  }
};

export { getEventReservations };

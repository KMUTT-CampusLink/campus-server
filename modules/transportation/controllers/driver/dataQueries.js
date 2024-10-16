// intial setup for orientation purposes
import prisma from "../../../../core/db/prismaInstance.js";

export default async function queryBookingsForTripByID(req, res) {
  try {
    const bookings = await prisma.trip_booking.findMany({
      where: {
        trip_id: req.body.trip_id,
      },
    });

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching bookings." });
  } finally {
    await prisma.$disconnect();
  }
}

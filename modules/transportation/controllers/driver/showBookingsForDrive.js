// intial setup for orientation purposes
import prisma from "../../../../core/db/prismaInstance.js";

export default async function showBookingsForDrive(req, res) {
  try {
    const bookings = await prisma.trip_booking.findMany({
      select: { booking_id: true },
      where: { status: "confirm" },
      include: {
        trip: {
          include: {
            driver: {
              where: {
                driver_id: req.user.id,
              },
            },
          },
        },
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

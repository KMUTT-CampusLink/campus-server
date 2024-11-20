// intial setup for orientation purposes
import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";

export const queryBookingsForTripByID = errorHandler(async (req, res) => {
  const bookings = await prisma.trip_booking.findMany({
    where: {
      trip_id: req.body.trip_id,
    },
  });

  res.json({ bookings });
});

export const queryDriverTrips = errorHandler(async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: {
      driver_id: req.user.id,
    },
  });

  res.json({ trips });
});

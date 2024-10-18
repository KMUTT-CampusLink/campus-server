// intial setup for orientation purposes
import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";

export const queryBookingsForTrip = errorHandler(queryBookingsForTripByID);

export default async function queryBookingsForTripByID(req, res) {
  const bookings = await prisma.trip_booking.findMany({
    where: {
      trip_id: req.body.trip_id,
    },
  });

  res.json({ bookings });
}

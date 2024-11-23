import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";
import { BadRequestError, NotFoundError } from "../../utils/customErrors.js";

export const bookForTrip = errorHandler(async (req, res) => {
  if (!req.body.tripID) {
    throw new BadRequestError("Trip ID is missing");
  }
  const user_id = req.user.id;
  const trip_id = parseInt(req.body.tripID);
  console.log(trip_id);

  const existingBooking = await prisma.trip_booking.findFirst({
    where: {
      user_id: user_id,
      trip_id: trip_id,
    },
  });

  if (existingBooking) {
    return res.status(200).json({
      booking: existingBooking,
      message: "Booking already exists",
    });
  } else {
    const newBooking = await prisma.trip_booking.create({
      data: {
        user_id: user_id,
        trip_id: trip_id,
      },
    });
    res
      .status(200)
      .json({ booking: newBooking, message: "Booking successful" });
  }
});

export const deleteBooking = errorHandler(async (req, res) => {
  const bookingID = req.body?.bookingID;
  console.log(req.body);
  console.log(bookingID);

  if (!bookingID) {
    throw new BadRequestError("Booking ID is missing");
  }

  // Check if the booking exists
  const booking = await prisma.trip_booking.findUnique({
    where: { id: bookingID },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  // Delete the booking
  await prisma.trip_booking.delete({
    where: { id: bookingID },
  });

  res.status(200).json({ message: "Booking deleted successfully" });
});

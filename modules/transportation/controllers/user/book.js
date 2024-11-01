import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";

export const bookForTrip = errorHandler(async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  if (!req.body.tripID) {
    throw new BadRequestError("Trip ID is missing");
  }

  await prisma.trip_booking
    .findFirst({
      where: {
        user_id: req.user.id,
        trip_id: req.body.tripID,
      },
    })
    .then((booking) => {
      if (booking) {
        return res.json({ booking, message: "This booking already exists" });
      }
    });

  await prisma.trip_booking
    .create({
      data: {
        user_id: req.user.id,
        trip_id: req.body.tripID,
      },
    })
    .then((booking) => {
      return res.json({ booking, message: "Booking successful" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: "Booking failed" });
    });
});

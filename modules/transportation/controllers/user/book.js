import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";

export const bookForTrip = errorHandler(async (req, res) => {
  await prisma.trip_booking
    .create({
      data: {
        user_id: req.user.id,
        trip_id: req.body.tripID,
      },
    })
    .then((booking) => {
      return res.json({ booking });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: "Booking failed" });
    });
});

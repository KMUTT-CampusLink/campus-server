import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";
import {
  UnauthorizedError,
  BadRequestError,
} from "../../utils/customErrors.js";

export const queryUserBookings = errorHandler(async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  const bookings = await prisma.trip_booking.findMany({
    where: { user_id: req.user.id },
  });
  res.json({ bookings });
});

export const queryRoutesConnectingStops = errorHandler(async (req, res) => {
  const startStop = parseInt(req.params.startStopID);
  const endStop = parseInt(req.params.endStopID);

  if (!startStop || !endStop) {
    throw new BadRequestError(
      "Incorrect parameters: startStopID or endStopID is missing or invalid"
    );
  }

  const routes = await prisma.route.findMany({
    include: {
      connection: {
        include: {
          stop_connection_start_idTostop: true,
          stop_connection_end_idTostop: true,
        },
      },
    },
    where: {
      AND: [
        { connection: { some: { start_id: startStop } } },
        { connection: { some: { end_id: endStop } } },
      ],
    },
  });
  console.log(routes);
  res.json({ routes });
});

export const queryRoutesByStopID = errorHandler(async (req, res) => {
  const stopID = parseInt(req.params.stopID);

  if (!stopID) {
    throw new BadRequestError(
      "Incorrect parameters: stopId is missing or invalid"
    );
  }

  const routes = await prisma.route.findMany({
    where: {
      OR: [
        { connection: { some: { start_id: stopID } } },
        { connection: { some: { end_id: stopID } } },
      ],
    },
  });
  res.json({ routes });
});

export const queryAllStops = errorHandler(async (req, res) => {
  const stops = await prisma.stop.findMany();
  res.json({ stops });
});

export const queryTripsByRouteID = errorHandler(async (req, res) => {
  const routeID = parseInt(req.params.routeID);
  if (!routeID) {
    throw new BadRequestError(
      "Incorrect parameters: routeID is missing or invalid"
    );
  }

  const trips = await prisma.trip.findMany({
    include: { trip_schedule: true },
    where: { trip_schedule: { route_id: routeID } },
  });
  res.json({ trips });
});

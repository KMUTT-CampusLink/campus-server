import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";

export const queryRoutesConnectingStops = errorHandler(async (req, res) => {
  //selecting all the routes which go through the start and end stops in this order

  const startStop = parseInt(req.params.startStopID);
  const endStop = parseInt(req.params.endStopID);

  if (!startStop || !endStop) {
    return res.status(400).json({
      error:
        "Incorrect parameters: startStopID or endStopID is missing or invalid",
    });
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

export const queryStopsByRouteID = errorHandler(async (req, res) => {
  const stops = await prisma.stop.findMany({
    where: { connection: { some: { route_id: req.body.routeID } } },
  });
  res.json({ stops });
});

export const queryRoutesByStopId = errorHandler(async (req, res) => {
  const stopID = parseInt(req.params.stopID);

  if (!stopID) {
    return res.status(400).json({
      error: "Incorrect parameters: stopId is missing or invalid",
    });
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

export const queryTripsByRouteId = errorHandler(async (req, res) => {
  const routeID = parseInt(req.params.routeID);

  if (!routeID) {
    return res.status(400).json({
      error: "Incorrect parameters: routeID is missing or invalid",
    });
  }

  const trips = await prisma.trip.findMany({
    include: { trip_schedule: true },
    where: { trip_schedule: { route_id: routeID } },
  });
  res.json({ trips });
});

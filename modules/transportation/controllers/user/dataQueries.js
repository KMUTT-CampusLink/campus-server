import prisma from "../../../../core/db/prismaInstance.js";
import errorHandler from "../../utils/errorHandler.js";

export const queryRoutesConnectingTwoStops = errorHandler(async (req, res) => {
  //selecting all the routes which go through the start and end stops in this order
  const routes = await prisma.route.findMany({
    select: { id: true, name: true },
    where: {
      AND: [
        { connection: { some: { start_id: req.body.start_stop_id } } },
        { connection: { some: { end_id: req.body.end_stop_id } } },
      ],
    },
  });
  res.json({ routes });
});

export const queryStopsByRouteId = errorHandler(async (req, res) => {
  const stops = await prisma.stop.findMany({
    where: { connection: { some: { route_id: req.body.routeId } } },
  });
  res.json({ stops });
});

export const queryRoutesByStopId = errorHandler(async (req, res) => {
  const routes = await prisma.route.findMany({
    where: { connection: { some: { start_id: req.body.stopId } } },
  });
  res.json({ routes });
});

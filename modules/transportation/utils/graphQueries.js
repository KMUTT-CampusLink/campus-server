import prisma from "../../../core/db/prismaInstance.js";

export default async function showRoutesBetweenStops(req, res) {
  try {
    //selecting all the routes which go through the start and end stops
    const routes = await prisma.route.findMany({
      where: {
        connection: {
          some: {
            OR: [
              { start_id: req.body.start_stop_id },
              { end_id: req.body.end_stop_id },
            ],
          },
        },
      },
      include: {
        connection: {
          where: {
            OR: [
              { start_id: req.body.start_stop_id },
              { end_id: req.body.end_stop_id },
            ],
          },
        },
      },
    });

    //postprocessing to get only those routes which go through both the stops in the correct order
    const filteredRoutes = routes.filter((route) => {
      return (
        (route.connection.length == 1 && // case if there is only one edge in the path, then it has to be the edge between the start and end stops
          route.connection[0].start_id == req.body.start_stop_id &&
          route.connection[0].end_id == req.body.end_stop_id) ||
        (route.connection.length == 2 && //case if there are two edges in the path containing the stop, then checking if they go in the right direction
          ((route.connection[0].sequence > route.connection[1].sequence &&
            route.connection[1].start_id == req.body.start_stop_id &&
            route.connection[0].end_id == req.body.start_stop_id) ||
            (route.connection[0].sequence < route.connection[1].sequence &&
              route.connection[0].start_id == req.body.start_stop_id &&
              route.connection[1].end_id == req.body.start_stop_id)))
      );
    });

    res.json({ filteredRoutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

import prisma from "../../../core/db/prismaInstance.js";

export default async function showRoutesBetweenStops(req, res) {
  try {
    //selecting all the routes which go through the start and end stops in this order
    const routes = await prisma.route.findMany({
      where: {
        AND: [
          { connection: { some: { start_id: req.body.start_stop_id } } },
          { connection: { some: { end_id: req.body.end_stop_id } } },
        ],
      },
    });

    res.json({ routes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

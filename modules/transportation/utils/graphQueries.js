import prisma from "../../../core/db/prismaInstance.js";

export default async function showRoutesBetweenStops(req, res) {
  try {
    let routes;
    await prisma.$transaction(async (prisma) => {
      routes = await prisma.route.findMany({
        include: {
          connections: {
            include: {
              stop: true,
            },
            where: {
              OR: [
                { stop_id: req.body.start_stop_id },
                { stop_id: req.body.end_stop_id },
              ],
            },
          },
        },
      });
    });

    const queryResponse = await prisma.user.findMany({});
    res.json({ queryResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred ..." });
  } finally {
    await prisma.$disconnect();
  }
}

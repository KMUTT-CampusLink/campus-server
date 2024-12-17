import prisma from "../../../../../core/db/prismaInstance.js";

export const transportationBookingController = async(startStop, endStop, day)=>{
    let start_id = await prisma.$queryRaw`
        SELECT id 
        FROM "stop"
        WHERE name = ${startStop}
    `
    start_id = parseInt(start_id[0].id);
    let end_id = await prisma.$queryRaw`
        SELECT id 
        FROM "stop"
        WHERE name = ${endStop}
    `
    end_id = parseInt(end_id[0].id);
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
            { connection: { some: { start_id: start_id } } },
            { connection: { some: { end_id: end_id } } },
          ],
        },
    });
    if(!routes || routes.length === 0){
        return routes;
    }
    const route_id = parseInt(routes[0].id);
    const trips = await prisma.trip.findMany({
        include: {
          trip_schedule: true,
        },
        where: {
          trip_schedule: {
            day: day, // Filter by the enum value for day
            route_id: route_id, // Filter by route_id
          },
        },
        orderBy: {
          trip_date: 'asc', // Sort by trip_date in ascending order
        },
        take: 3, // Limit to 4 rows
      });           
    return trips;
}
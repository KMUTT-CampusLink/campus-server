import { number } from "zod";
import prisma from "../../../core/db/prismaInstance.js";

export default async function querryAllData(req, res) {
  try {
    //fetching data from tables
    const users = await prisma.user.findMany();
    const stops = await prisma.stop.findMany();
    const routes = await prisma.route.findMany();
    const connections = await prisma.connection.findMany();
    const schedules = await prisma.trip_schedule.findMany();
    const vehicles = await prisma.vehicle.findMany();
    const trips = await prisma.trip.findMany();
    const drivers = await prisma.driver.findMany();
    const employees = await prisma.employee.findMany();
    const bookings = await prisma.trip_booking.findMany();

    //response with all the data
    res.status(200).json({
      users,
      stops,
      routes,
      connections,
      schedules,
      vehicles,
      trips,
      drivers,
      employees,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while populating database." });
  } finally {
    await prisma.$disconnect();
  }
}

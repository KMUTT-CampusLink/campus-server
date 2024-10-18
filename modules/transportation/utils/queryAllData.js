import prisma from "../../../core/db/prismaInstance.js";
import errorHandler from "./errorHandler.js";

export const queryAllData = errorHandler(async (req, res) => {
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
});

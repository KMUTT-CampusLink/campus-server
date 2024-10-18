import prisma from "../../../core/db/prismaInstance.js";
import errorHandler from "./errorHandler.js";

export const populateDatabaseWithTestData = errorHandler(async (req, res) => {
  // making all db operations a transaction for data safety
  await prisma.$transaction(async (prisma) => {
    //delete all data from tables
    await prisma.trip_booking.deleteMany(); //references trip and user
    await prisma.trip.deleteMany(); //references driver, schedule, vehicle
    await prisma.driver.deleteMany(); //references employee
    await prisma.employee.deleteMany(); //references user
    await prisma.trip_schedule.deleteMany(); //references route
    await prisma.connection.deleteMany(); //references 2 stops and route
    await prisma.user.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.route.deleteMany();
    await prisma.stop.deleteMany();

    //test data to insert into tables
    const employeesData = [
      {
        id: "EMP00001",
        firstname: "John",
        midname: "A.",
        lastname: "Doe",
        phone: "1234567890",
        address: "123 Main St",
        date_of_birth: new Date("1980-01-01"),
        gender: "Male",
        identification_no: "ID123456",
        passport_no: "P123456",
        user_id: "1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        position: "Driver",
        job_title: "Senior Driver",
        salary: 50000,
        bonus: 5000,
      },
      {
        id: "EMP00002",
        firstname: "Jane",
        midname: "B.",
        lastname: "Smith",
        phone: "0987654321",
        address: "456 Elm St",
        date_of_birth: new Date("1985-02-02"),
        gender: "Female",
        identification_no: "ID654321",
        passport_no: "P654321",
        user_id: "2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        position: "Driver",
        job_title: "Junior Driver",
        salary: 45000,
        bonus: 4500,
      },
    ];

    const driversData = [
      {
        id: 1,
        emp_id: "EMP00001",
        license_no: "LIC123456",
      },
      {
        id: 2,
        emp_id: "EMP00002",
        license_no: "LIC654321",
      },
    ];

    const usersData = [
      {
        id: "1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        campus_email: "mail1@campus",
        password: "password1",
        personal_email: "mail1@personal",
        role: "Driver",
      },
      {
        id: "2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        campus_email: "mail2@campus",
        password: "password2",
        personal_email: "mail2@personal",
        role: "Driver",
      },
      {
        id: "3aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        campus_email: "mail3@campus",
        password: "password3",
        personal_email: "mail3@personal",
        role: "Student",
      },
      {
        id: "4aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        campus_email: "mail4@campus",
        password: "password4",
        personal_email: "mail4@personal",
        role: "Student",
      },
    ];

    const stopsData = [
      { id: 1, name: "Stop 1" },
      { id: 2, name: "Stop 2" },
      { id: 3, name: "Stop 3" },
      { id: 4, name: "Stop 4" },
      { id: 5, name: "Stop 5" },
      { id: 6, name: "Stop 6" },
    ];

    const routesData = [
      { id: 1, name: "Route 1" },
      { id: 2, name: "Route 2" },
      { id: 3, name: "Route 3" },
      { id: 4, name: "Route 1 Reverse" },
      { id: 5, name: "Route 2 Reverse" },
      { id: 6, name: "Route 3 Reverse" },
    ];

    const connectionsData = [
      //route 1 going 1-2-3
      { id: 1, route_id: 1, start_id: 1, end_id: 2, sequence: 1 },
      { id: 2, route_id: 1, start_id: 2, end_id: 3, sequence: 2 },
      //route 2 going 2-3-4-5
      { id: 3, route_id: 2, start_id: 2, end_id: 3, sequence: 1 },
      { id: 4, route_id: 2, start_id: 3, end_id: 4, sequence: 2 },
      { id: 5, route_id: 2, start_id: 4, end_id: 5, sequence: 3 },
      //route 3 going 4-5-6
      { id: 6, route_id: 3, start_id: 4, end_id: 5, sequence: 1 },
      { id: 7, route_id: 3, start_id: 5, end_id: 6, sequence: 2 },
      //route 1 reverse 3-2-1
      { id: 8, route_id: 4, start_id: 3, end_id: 2, sequence: 1 },
      { id: 9, route_id: 4, start_id: 2, end_id: 1, sequence: 2 },
      //route 2 reverse 5-4-3-2
      { id: 10, route_id: 5, start_id: 5, end_id: 4, sequence: 1 },
      { id: 11, route_id: 5, start_id: 4, end_id: 3, sequence: 2 },
      { id: 12, route_id: 5, start_id: 3, end_id: 2, sequence: 3 },
      //route 3 reverse 6-5-4
      { id: 13, route_id: 6, start_id: 6, end_id: 5, sequence: 1 },
      { id: 14, route_id: 6, start_id: 5, end_id: 4, sequence: 2 },
    ];

    const scheduleData = [
      {
        id: 1,
        route_id: 1,
        day: "Monday",
        start_time: new Date(new Date().setHours(9, 0, 0, 0)),
        end_time: new Date(new Date().setHours(10, 0, 0, 0)),
        status: true,
      },
      {
        id: 2,
        route_id: 4, // Route 1 Reverse
        day: "Monday",
        start_time: new Date(new Date().setHours(10, 15, 0, 0)),
        end_time: new Date(new Date().setHours(11, 15, 0, 0)),
        status: true,
      },
      {
        id: 3,
        route_id: 2,
        day: "Monday",
        start_time: new Date(new Date().setHours(11, 30, 0, 0)),
        end_time: new Date(new Date().setHours(12, 30, 0, 0)),
        status: true,
      },
      {
        id: 4,
        route_id: 5, // Route 2 Reverse
        day: "Monday",
        start_time: new Date(new Date().setHours(12, 45, 0, 0)),
        end_time: new Date(new Date().setHours(13, 45, 0, 0)),
        status: true,
      },
      {
        id: 5,
        route_id: 3,
        day: "Monday",
        start_time: new Date(new Date().setHours(14, 0, 0, 0)),
        end_time: new Date(new Date().setHours(15, 0, 0, 0)),
        status: true,
      },
      {
        id: 6,
        route_id: 6, // Route 3 Reverse
        day: "Monday",
        start_time: new Date(new Date().setHours(15, 15, 0, 0)),
        end_time: new Date(new Date().setHours(16, 15, 0, 0)),
        status: true,
      },
    ];

    const vehiclesData = [
      { id: 1, registration_no: "ABC123", capacity: 50 },
      { id: 2, registration_no: "XYZ789", capacity: 40 },
      { id: 3, registration_no: "LMN456", capacity: 30 },
    ];

    const tripsData = [
      {
        id: 1,
        driver_id: 1,
        trip_schedule_id: 1,
        vehicle_id: 1,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        id: 2,
        driver_id: 2,
        trip_schedule_id: 1,
        vehicle_id: 2,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 14)),
      },
      {
        id: 3,
        driver_id: 1,
        trip_schedule_id: 2,
        vehicle_id: 1,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        id: 4,
        driver_id: 2,
        trip_schedule_id: 2,
        vehicle_id: 2,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 14)),
      },
      {
        id: 5,
        driver_id: 1,
        trip_schedule_id: 3,
        vehicle_id: 1,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        id: 6,
        driver_id: 2,
        trip_schedule_id: 3,
        vehicle_id: 2,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 14)),
      },
      {
        id: 7,
        driver_id: 1,
        trip_schedule_id: 4,
        vehicle_id: 1,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        id: 8,
        driver_id: 2,
        trip_schedule_id: 4,
        vehicle_id: 2,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 14)),
      },
      {
        id: 9,
        driver_id: 1,
        trip_schedule_id: 5,
        vehicle_id: 1,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        id: 10,
        driver_id: 2,
        trip_schedule_id: 5,
        vehicle_id: 2,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 14)),
      },
      {
        id: 11,
        driver_id: 1,
        trip_schedule_id: 6,
        vehicle_id: 1,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        id: 12,
        driver_id: 2,
        trip_schedule_id: 6,
        vehicle_id: 2,
        trip_date: new Date(new Date().setDate(new Date().getDate() + 14)),
      },
    ];

    const bookingsData = [
      {
        id: 1,
        user_id: "3aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // Student 1
        trip_id: 1,
        status: "Confirm",
      },
      {
        id: 2,
        user_id: "4aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // Student 2
        trip_id: 1,
        status: "Confirm",
      },
      {
        id: 3,
        user_id: "3aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // Student 1
        trip_id: 2,
        status: "Confirm",
      },
      {
        id: 4,
        user_id: "4aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // Student 2
        trip_id: 2,
        status: "Confirm",
      },
    ];

    //executing the insert queries
    await prisma.user.createMany({ data: usersData });
    await prisma.employee.createMany({ data: employeesData });
    await prisma.driver.createMany({ data: driversData });
    await prisma.vehicle.createMany({ data: vehiclesData });
    await prisma.stop.createMany({ data: stopsData });
    await prisma.route.createMany({ data: routesData });
    await prisma.connection.createMany({ data: connectionsData });
    await prisma.trip_schedule.createMany({ data: scheduleData });
    await prisma.trip.createMany({ data: tripsData });
    await prisma.trip_booking.createMany({ data: bookingsData });
  });
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

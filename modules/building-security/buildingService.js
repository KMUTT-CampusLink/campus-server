import prisma from '../../../campus-server/core/db/prismaInstance.js';

const parseTime = (date, time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const parsedDate = new Date(date);
  parsedDate.setHours(hours, minutes, 0, 0);
  return parsedDate;
};

export const getBuildings = async () => {
  try {
    return await prisma.building.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    console.error("Error fetching buildings:", error);
    throw new Error("Could not retrieve buildings");
  }
};

export const getFloorsByBuildingId = async (buildingId) => {
  try {
    return await prisma.floor.findMany({
      where: { building_id: parseInt(buildingId, 10) },
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    console.error("Error fetching floors:", error);
    throw new Error("Could not retrieve floors");
  }
};

export const getRoomsByFloorId = async (floorId) => {
  try {
    return await prisma.room.findMany({
      where: { floor_id: parseInt(floorId, 10) },
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error("Could not retrieve rooms");
  }
};

export const isTimeAvailable = async (roomId, date, newStartTime, newEndTime) => {
  const parsedStartTime = parseTimeString(date, newStartTime.split("T")[1]);
  const parsedEndTime = parseTimeString(date, newEndTime.split("T")[1]);

  // Find overlapping bookings
  const existingBookings = await prisma.room_booking.findMany({
    where: {
      room_id: parseInt(roomId, 10),
      booking_date: new Date(date),
      AND: [
        { start_time: { lt: parsedEndTime } },
        { end_time: { gt: parsedStartTime } },
      ],
    },
    orderBy: { end_time: 'desc' },
  });

  if (existingBookings.length > 0) {
    // If there are overlapping bookings, get the latest end time from them
    const maxEndTime = existingBookings[0].end_time;
    return { available: false, maxEndTime };
  }

  return { available: true };
};




const parseTimeString = (date, time) => {
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  // Convert to 24-hour format if period is PM and hours are not 12
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0; // Midnight case
  }

  const formattedDate = `${date} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.0000000`;
  const timestamp = new Date(formattedDate);

  if (isNaN(timestamp.getTime())) {
    throw new Error(`Invalid date format for start or end time: ${formattedDate}`);
  }

  return timestamp;
};

export const createNewBooking = async (userId, roomId, date, startTime, endTime) => {
  try {
    // Fetch the latest booking ID
    const latestBooking = await prisma.room_booking.findFirst({
      orderBy: { id: 'desc' },
    });

    // Determine the new ID
    const latestId = latestBooking ? latestBooking.id : 0;
    const newId = latestId + 1;

    // Parse start and end times to correct format
    const startTimestamp = parseTimeString(date, startTime.split("T")[1]);
    const endTimestamp = parseTimeString(date, endTime.split("T")[1]);

    if (isNaN(startTimestamp.getTime()) || isNaN(endTimestamp.getTime())) {
      throw new Error("Invalid date format for start or end time");
    }

    // Create a new booking with correctly formatted start and end times
    const newBooking = await prisma.room_booking.create({
      data: {
        id: newId,
        user_id: userId,
        room_id: parseInt(roomId, 10),
        booking_date: new Date(date),
        start_time: startTimestamp, // Correctly formatted start time
        end_time: endTimestamp,      // Correctly formatted end time
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    console.log("New booking created with ID:", newBooking.id);
    return newBooking;
  } catch (error) {
    console.error("Error creating booking:", error); // Log the exact error for debugging
    throw new Error("An error occurred while creating the booking.");
  }
};

export const getBooked = async () => {
  try {
    return await prisma.room_booking.findMany({
      select: {
        id: true,
        room_id: true,
        booking_date: true,
        start_time: true,
        end_time: true,
        room: {           // This assumes a relation exists between room_booking and room in Prisma schema
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { room_id: 'asc' },
        { booking_date: 'asc' },
        { start_time: 'asc' },
      ],
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Could not retrieve bookings");
  }
};


export const deleteBooking = async (id) => {
  try {
    await prisma.room_booking.delete({
      where: { id: parseInt(id, 10) }, // Ensure ID is an integer
    });
    console.log(`Booking with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Could not delete booking");
  }
};

export const getAvailableTimes = async (roomId, date) => {
  try {
    // Validate input
    if (!roomId || !date) {
      throw new Error("Invalid parameters: roomId and date are required.");
    }

    const existingBookings = await prisma.room_booking.findMany({
      where: {
        room_id: parseInt(roomId, 10),
        booking_date: new Date(date),
      },
      orderBy: {
        start_time: 'asc',
      },
    });

    // Check if existingBookings is an array; if not, initialize it as an empty array
    if (!Array.isArray(existingBookings)) {
      console.error("Warning: existingBookings is not an array.");
      return { availableTimes: [], message: "No bookings available for this room and date" };
    }

    // Calculate available times based on existing bookings
    const availableTimes = calculateAvailableTimes(existingBookings);
    return { availableTimes };
  } catch (error) {
    console.error("Error in getAvailableTimes:", error);
    throw new Error("Could not fetch available times.");
  }
};


// Helper function to generate all time slots for the day (e.g., 8:30 AM to 7:00 PM in 30-minute intervals)
const generateAllDaySlots = () => {
  const slots = [];
  let startTime = new Date(0, 0, 0, 8, 30);
  const endTime = new Date(0, 0, 0, 19, 0);

  while (startTime < endTime) {
    slots.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    startTime.setMinutes(startTime.getMinutes() + 30);
  }
  return slots;
};

// Function to calculate available time slots based on existing bookings
const calculateAvailableTimes = (existingBookings) => {
  const availableTimes = [];
  let startTime = new Date(0, 0, 0, 8, 30); // Start time for reservations
  const endTime = new Date(0, 0, 0, 19, 0); // End time boundary for the day

  // If there are no existing bookings, fill the entire day with time slots
  if (existingBookings.length === 0) {
    while (startTime < endTime) {
      availableTimes.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    return availableTimes;
  }

  // Iterate over existing bookings to determine available times
  for (const booking of existingBookings) {
    const bookingStartTime = new Date(booking.start_time);
    const bookingEndTime = new Date(booking.end_time);

    // Fill available times up to the start of the current booking
    while (startTime < bookingStartTime && startTime < endTime) {
      availableTimes.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    // Move startTime to the end of the current booking to avoid overlap
    if (startTime < bookingEndTime) {
      startTime = new Date(bookingEndTime);
    }
  }

  // Fill in remaining slots after the last booking, up to the end of the day
  while (startTime < endTime) {
    availableTimes.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    startTime.setMinutes(startTime.getMinutes() + 30);
  }

  return availableTimes;
};


const generateTimeSlots = () => {
  const startSlots = [];
  const endSlots = [];
  let current = new Date(0, 0, 0, 8, 30); // Start at 8:30 AM
  const endStart = new Date(0, 0, 0, 19, 0); // Last start time is 7:00 PM
  const endEnd = new Date(0, 0, 0, 19, 30); // Last end time is 7:30 PM

  // Generate start time slots up to 7:00 PM
  while (current <= endStart) {
    startSlots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    current.setMinutes(current.getMinutes() + 30);
  }

  // Reset current to start from 9:00 AM for end time slots
  current = new Date(0, 0, 0, 9, 0);

  // Generate end time slots up to 7:30 PM
  while (current <= endEnd) {
    endSlots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    current.setMinutes(current.getMinutes() + 30);
  }

  return { startSlots, endSlots };
};
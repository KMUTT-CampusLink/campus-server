import prisma from "../../../core/db/prismaInstance.js";
import moment from "moment-timezone";

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Haversine formula to calculate distance between two points (lat, lon)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

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

export const getGBuildings = async () => {
  try {
    return await prisma.building.findMany({
      where: {
        guard_status: true,
      },
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

export const getGuards = async () => {
  try {
    const guards = await prisma.guard.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        employee_id: true,
        employee: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    const result = guards.map(guard => ({
      ...guard,
      fullName: `${guard.employee.firstname} ${guard.employee.lastname}`,
    }));

    return result;
  } catch (error) {
    console.error("Error fetching guards:", error);
    throw new Error("Could not retrieve guards");
  }
};



export const getBuildingsWithRoom = async () => {
  try {
    return await prisma.building.findMany({
      where: {
        floor: {
          some: {
            room: {
              some: {},
            },
          },
        },
      },
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

export const isTimeAvailable = async (
  roomId,
  date,
  newStartTime,
  newEndTime
) => {
  // Parse the input start and end times
  const parsedStartTime = parseTimeString(date, newStartTime.split("T")[1]);
  const parsedEndTime = parseTimeString(date, newEndTime.split("T")[1]);

  // Log parsed times for debugging
  console.log("Parsed Start Time:", parsedStartTime);
  console.log("Parsed End Time:", parsedEndTime);

  // Fetch existing bookings for the room on the given date
  const existingBookings = await prisma.room_booking.findMany({
    where: {
      room_id: parseInt(roomId, 10),
      booking_date: new Date(date),
      AND: [
        { start_time: { lt: parsedEndTime } }, // Existing booking starts before the new end time
        { end_time: { gt: parsedStartTime } }, // Existing booking ends after the new start time
      ],
    },
    orderBy: { start_time: "asc" }, // Order by start time for better debugging
  });

  // Allow adjacent bookings (new start matches an existing end)
  for (const booking of existingBookings) {
    if (
      parsedStartTime.getTime() === new Date(booking.end_time).getTime() ||
      parsedEndTime.getTime() === new Date(booking.start_time).getTime()
    ) {
      continue; // This is an adjacent booking and should be allowed
    }

    // Overlapping booking found
    console.log("Overlapping booking found:", booking);
    return {
      available: false,
      overlappingBooking: {
        start_time: booking.start_time,
        end_time: booking.end_time,
      },
    };
  }

  // If no overlaps are found, return available
  return { available: true };
};

const parseTimeString = (date, time) => {
  const [hoursMinutes, period] = time.split(" "); // Split time into hours:minutes and AM/PM
  let [hours, minutes] = hoursMinutes.split(":").map(Number);

  // Convert to 24-hour format if period is PM and hours are not 12
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0; // Midnight case
  }

  // Combine date with time to form a proper timestamp
  const formattedDate = `${date}T${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:00.000Z`;

  // Create a new Date object
  const timestamp = new Date(formattedDate);

  if (isNaN(timestamp.getTime())) {
    throw new Error(
      `Invalid date or time format: Date: ${date}, Time: ${time}`
    );
  }

  return timestamp;
};

export const createNewBooking = async (
  userId,
  roomId,
  date,
  startTime,
  endTime
) => {
  try {
    const parsedStartTime = parseTimeString(date, startTime.split("T")[1]);
    const parsedEndTime = parseTimeString(date, endTime.split("T")[1]);

    const newBooking = await prisma.room_booking.create({
      data: {
        user_id: userId,
        room_id: parseInt(roomId, 10),
        booking_date: new Date(date),
        start_time: parsedStartTime,
        end_time: parsedEndTime,
      },
    });

    console.log("New booking created:", newBooking);
    return newBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
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
        room: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { room_id: "asc" },
        { booking_date: "asc" },
        { start_time: "asc" },
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
        start_time: "asc",
      },
    });

    // Check if existingBookings is an array; if not, initialize it as an empty array
    if (!Array.isArray(existingBookings)) {
      console.error("Warning: existingBookings is not an array.");
      return {
        availableTimes: [],
        message: "No bookings available for this room and date",
      };
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
    slots.push(
      startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
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
      availableTimes.push(
        startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
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
      availableTimes.push(
        startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    // Move startTime to the end of the current booking to avoid overlap
    if (startTime < bookingEndTime) {
      startTime = new Date(bookingEndTime);
    }
  }

  // Fill in remaining slots after the last booking, up to the end of the day
  while (startTime < endTime) {
    availableTimes.push(
      startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    startTime.setMinutes(startTime.getMinutes() + 30);
  }

  return availableTimes;
};

const generateTimeSlots = () => {
  const startSlots = [];
  const endSlots = [];
  let current = new Date(0, 0, 0, 8, 30); // Start at 8:30 AM
  current.setHours(current.getHours() + 7); // Adjust to UTC+7
  const endStart = new Date(0, 0, 0, 19, 0); // Last start time is 7:00 PM
  const endEnd = new Date(0, 0, 0, 19, 30); // Last end time is 7:30 PM

  // Generate start time slots up to 7:00 PM
  while (current <= endStart) {
    startSlots.push(
      current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    current.setMinutes(current.getMinutes() + 30);
  }

  // Reset current to start from 9:00 AM for end time slots
  current = new Date(0, 0, 0, 9, 0);

  // Generate end time slots up to 7:30 PM
  while (current <= endEnd) {
    endSlots.push(
      current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    current.setMinutes(current.getMinutes() + 30);
  }

  return { startSlots, endSlots };
};

export const createNewGBooking = async (userId, buildingId, guardId, details) => {
  try {
    const newGBooking = await prisma.$transaction(async (prisma) => {

      guardId = parseInt(guardId, 10);
      buildingId = parseInt(buildingId, 10);

      // Create the new guard booking
      const newGBooking = await prisma.guard_schedule.create({
        data: {
          user_id: userId,
          building_id: buildingId,
          guard_id: guardId,
          description: details,
        },
      });

      // Update the guard's status to false
      const updateGuardStatus = await prisma.guard.update({
        where: {
          id: guardId,
        },
        data: {
          status: false, // Set guard status to false after booking
        },
      });

      // Fetch the latitude and longitude of the building where the guard is assigned
      const guardBuilding = await prisma.building.findUnique({
        where: { id: parseInt(buildingId, 10) },
        select: { id: true, latitude: true, longitude: true },
      });

      if (!guardBuilding) {
        throw new Error(`Building with id ${buildingId} not found.`);
      }

      const { latitude, longitude } = guardBuilding;

      // Fetch all buildings except the one where the guard is assigned
      const allBuildings = await prisma.building.findMany({
        where: {
          id: {
            not: buildingId, // Exclude the current building
          },
        },
        select: { id: true, latitude: true, longitude: true },
      });

      // Filter buildings within 50 meters
      const nearbyBuildings = allBuildings.filter(building => {
        const distance = calculateDistance(latitude, longitude, building.latitude, building.longitude);
        return distance < 0.05; // Distance less than 50 meters (0.05 km)
      });

      // Extract the building IDs that are within 50 meters
      const nearbyBuildingIds = nearbyBuildings.map(building => building.id);

      // Update the status of these nearby buildings to false
      await prisma.building.updateMany({
        where: {
          id: {
            in: nearbyBuildingIds, // Only update buildings in the nearbyBuildingIds array
          },
        },
        data: {
          guard_status: false, // Set the guard status to false
        },
      });

      return { newGBooking, updateGuardStatus, updatedBuildings: nearbyBuildingIds };
    });

    console.log("Transaction successful:", newGBooking);
    return newGBooking;

  } catch (error) {
    console.error("Error creating booking:", error.message);
    throw new Error(`An error occurred while creating the booking: ${error.message}`);
  }
};
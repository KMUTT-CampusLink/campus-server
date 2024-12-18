import {
  getBuildings,
  getBuildingsWithRoom,
  getFloorsByBuildingId,
  getRoomsByFloorId,
  isTimeAvailable,
  createNewBooking,
  getBooked,
  getAvailableTimes,
  deleteBooking,
  getGuards,
  getGBuildings,
  createNewGBooking,
} from "./buildingService.js";

export const fetchGBuildingData = async (req, res) => {
  try {
    const buildings = await getGBuildings();
    res.status(200).json(buildings);
  } catch (error) {
    console.error("Error in building controller:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching building data." });
  }
};

export const fetchGuardData = async (req, res) => {
  try {
    const guards = await getGuards();
    console.log("Guards fetched:", guards);
    res.status(200).json(guards);
  } catch (error) {
    console.error("Error in guard controller:", error);
    res.status(500).json({ message: "An error occurred while fetching guard data." });
  }
};


export const fetchBuildingData = async (req, res) => {
  try {
    const buildings = await getBuildings();
    res.status(200).json(buildings);
  } catch (error) {
    console.error("Error in building controller:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching building data." });
  }
};

export const fetchBuildingWithRoomData = async (req, res) => {
  try {
    const buildings = await getBuildingsWithRoom();
    res.status(200).json(buildings);
  } catch (error) {
    console.error("Error in building controller:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching building data." });
  }
};

export const fetchFloorsByBuildingId = async (req, res) => {
  const { buildingId } = req.params;
  try {
    const floors = await getFloorsByBuildingId(buildingId);
    res.status(200).json(floors);
  } catch (error) {
    console.error("Error fetching floors:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching floors." });
  }
};

export const fetchRoomsByFloorId = async (req, res) => {
  const { floorId } = req.params;
  try {
    const rooms = await getRoomsByFloorId(floorId);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching rooms." });
  }
};

export const fetchBooked = async (req, res) => {
  try {
    const booked = await getBooked();
    res.status(200).json(booked);
  } catch (error) {
    console.error("Error in building controller:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching building data." });
  }
};

export const deleteBookingController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteBooking(id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBookingController:", error);
    res.status(500).json({
      message: "An error occurred while deleting the booking.",
      error: error.message,
    });
  }
};

export const fetchAvailableTimesController = async (req, res) => {
  const { roomId, date } = req.query;

  try {
    const { availableTimes, message } = await getAvailableTimes(roomId, date);
    if (message) {
      res.status(200).json({ availableTimes, message });
    } else {
      res.status(200).json({ availableTimes });
    }
  } catch (error) {
    console.error("Error fetching available times:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching available times." });
  }
};

export const createBooking = async (req, res) => {
  const { roomId, bookingDate, startTime, endTime } = req.body;

  try {
    const userId = req.user.id;

    if (!roomId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields (roomId, bookingDate, startTime, endTime) are required.",
      });
    }

    console.log("Booking Data Received:", {
      userId,
      roomId,
      bookingDate,
      startTime,
      endTime,
    });

    // Check availability
    const availability = await isTimeAvailable(roomId, bookingDate, startTime, endTime);

    if (!availability.available) {
      return res.status(400).json({
        message: "Time slot is not available.",
        overlappingBookings: availability.overlappingBookings,
      });
    }

    // Create booking
    const newBooking = await createNewBooking(userId, roomId, bookingDate, startTime, endTime);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error in createBooking function:", error);
    res.status(500).json({ message: "An error occurred while creating the booking." });
  }
};

export const createGBooking = async (req, res) => {
  const { buildingId, guardId, details } = req.body;

  try {
    const userId = req.user.id;

    if (!buildingId || !guardId || !details) {
      return res.status(400).json({
        message: "All fields (buildingId, guardId, details) are required.",
      });
    }

    console.log("Booking Data Received:", {
      buildingId,
      guardId,
      details,
    });

    // Call the service to create the booking, update guard status, and update building status
    const result = await createNewGBooking(userId, buildingId, guardId, details);
    res.status(201).json(result);

  } catch (error) {
    // Log the error and send more details in the response for debugging
    console.error("Error in createBooking function:", error.message);
    res.status(500).json({
      message: "An error occurred while creating the booking.",
      error: error.message,  // Send the error message in the response to debug
      stack: error.stack,    // Include stack trace for more detailed debugging
    });
  }
};




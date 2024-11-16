import { getBuildings, getFloorsByBuildingId, getRoomsByFloorId, isTimeAvailable, createNewBooking, getBooked, getAvailableTimes, deleteBooking } from './buildingService.js';

export const fetchBuildingData = async (req, res) => {
  try {
    const buildings = await getBuildings();
    res.status(200).json(buildings);
  } catch (error) {
    console.error("Error in building controller:", error);
    res.status(500).json({ message: "An error occurred while fetching building data." });
  }
};

export const fetchFloorsByBuildingId = async (req, res) => {
  const { buildingId } = req.params;
  try {
    const floors = await getFloorsByBuildingId(buildingId);
    res.status(200).json(floors);
  } catch (error) {
    console.error("Error fetching floors:", error);
    res.status(500).json({ message: "An error occurred while fetching floors." });
  }
};

export const fetchRoomsByFloorId = async (req, res) => {
  const { floorId } = req.params;
  try {
    const rooms = await getRoomsByFloorId(floorId);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "An error occurred while fetching rooms." });
  }
};

export const fetchBooked = async (req, res) => {
  try {
    const booked = await getBooked();
    res.status(200).json(booked);
  } catch (error) {
    console.error("Error in building controller:", error);
    res.status(500).json({ message: "An error occurred while fetching building data." });
  }
};

export const deleteBookingController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteBooking(id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBookingController:", error); // Log detailed error
    res.status(500).json({ message: "An error occurred while deleting the booking.", error: error.message });
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
    res.status(500).json({ message: "An error occurred while fetching available times." });
  }
};

export const createBooking = async (req, res) => {
  const { userId, roomId, bookingDate, startTime, endTime } = req.body;

  if (!userId || !roomId || !bookingDate || !startTime || !endTime) {
    return res.status(400).json({ message: "All fields (userId, roomId, bookingDate, startTime, endTime) are required." });
  }

  console.log("Received Booking Data:", { userId, roomId, bookingDate, startTime, endTime }); // Log incoming data

  try {
    const availability = await isTimeAvailable(roomId, bookingDate, startTime, endTime);

    if (!availability.available) {
      return res.status(400).json({
        message: `Time slot is not available. Available up to ${availability.maxEndTime}.`,
      });
    }

    const newBooking = await createNewBooking(userId, roomId, bookingDate, startTime, endTime);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error in createBooking function:", error); // Log the full error
    res.status(500).json({ message: "An error occurred while creating the booking." });
  }
};
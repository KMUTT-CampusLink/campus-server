import { Router } from "express";
import {
  fetchBuildingData,
  fetchFloorsByBuildingId,
  fetchRoomsByFloorId,
  createBooking,
  fetchBooked,
  deleteBookingController,
  fetchAvailableTimesController,
} from "../buildingController.js";

const secureRouter = Router();

// Route to fetch buildings
secureRouter.get("/buildings", fetchBuildingData);

// Route to fetch floors by building ID
secureRouter.get("/floors/:buildingId", fetchFloorsByBuildingId);

// Route to fetch rooms by floor ID
secureRouter.get("/rooms/:floorId", fetchRoomsByFloorId);

// Route to fetch rooms from room_booking table that was reserved
secureRouter.get("/getBooked", fetchBooked);

// Route to get available time to calculate
secureRouter.get("/getAvailableTimes", fetchAvailableTimesController);

// Route to create a booking with time overlap check
secureRouter.post("/bookings", createBooking);

// Route to delete a booking by id that selected by delete icon
secureRouter.delete("/bookings/:id", deleteBookingController);

export { secureRouter };

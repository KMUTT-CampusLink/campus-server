import { Router } from "express";
import {
  fetchBuildingData,
  fetchBuildingWithRoomData,
  fetchFloorsByBuildingId,
  fetchRoomsByFloorId,
  createBooking,
  fetchBooked,
  deleteBookingController,
  fetchAvailableTimesController,
} from "../controllers/buildingController.js";
// import { getBuilding } from "../controllers/getBuilding.js";
// import { getFloor } from "../controllers/getFloor.js";
// import { getRoom } from "../controllers/getRoom.js";
// import your logics from controllers here
import { getLostAndFoundList } from "../controllers/getLostAndFoundList.js";
import { getMaintenanceList } from "../controllers/getMaintenanceList.js";
import { addMaintenanceList } from "../controllers/addMaintenanceList.js";
import { addLostAndFoundList } from "../controllers/addLostAndFoundList.js";
import { updateLostAndFoundList } from "../controllers/updateLostAndFoundList.js";
import { adminDeleteMaintenanceList } from "../controllers/adminDeleteMaintenanceList.js";
import verifyRoles from "../../../core/middleware/verifyRoles.js";

// import { deleteReturned } from "../controllers/deleteReturned.js";
const secureRouter = Router();

// Route to fetch buildings
secureRouter.get("/buildings", fetchBuildingData);

secureRouter.get("/buildingsWithRoom", fetchBuildingWithRoomData)

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

// secureRouter.get("/building", getBuilding);
// secureRouter.get("/floor", getFloor);
// secureRouter.get("/room", getRoom);
secureRouter.get("/LostAndFoundList", getLostAndFoundList);
secureRouter.get("/MaintenanceList", getMaintenanceList);
secureRouter.post("/addMaintenanceList", verifyRoles("Student", "Professor", "Staff"), addMaintenanceList);
secureRouter.post("/addLostAndFoundList", addLostAndFoundList);
secureRouter.patch("/updateStatus/:id", updateLostAndFoundList);
// secureRouter.delete("/deleteReturned", deleteReturned);
secureRouter.delete("/adminDeleteMaintenanceList/:id", verifyRoles("Professor", "Staff"), adminDeleteMaintenanceList);

export { secureRouter };

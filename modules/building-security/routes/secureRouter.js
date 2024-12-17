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
  fetchGuardData,
  fetchGBuildingData,
  createGBooking,
} from "../controllers/buildingController.js";

import { getLostAndFoundList } from "../controllers/getLostAndFoundList.js";
import { getMaintenanceList } from "../controllers/getMaintenanceList.js";
import { getGuardSchedule } from "../controllers/getGuardSchedule.js";
import { addMaintenanceList } from "../controllers/addMaintenanceList.js";
import { addLostAndFoundList } from "../controllers/addLostAndFoundList.js";
import { updateLostAndFoundList } from "../controllers/updateLostAndFoundList.js";
import { adminDeleteMaintenanceList } from "../controllers/adminDeleteMaintenanceList.js";
import { deleteGuard } from "../controllers/deleteGuard.js";
import verifyRoles from "../../../core/middleware/verifyRoles.js";
import { getLostAndFoundInterMap } from "../controllers/LostAndFoundControllerInterMap.js";

const secureRouter = Router();

secureRouter.get("/buildings", fetchBuildingData);

secureRouter.get("/buildingsWithRoom", fetchBuildingWithRoomData);

secureRouter.get("/floors/:buildingId", fetchFloorsByBuildingId);

secureRouter.get("/rooms/:floorId", fetchRoomsByFloorId);

secureRouter.get("/getBooked", fetchBooked);

secureRouter.get("/getAvailableTimes", fetchAvailableTimesController);

secureRouter.post("/bookings", createBooking);

secureRouter.delete("/bookings/:id", deleteBookingController);

secureRouter.get("/LostAndFoundList", getLostAndFoundList);

secureRouter.get("/MaintenanceList", getMaintenanceList);

secureRouter.post("/addMaintenanceList", verifyRoles("Student", "Professor", "Staff"), addMaintenanceList);

secureRouter.get("/GuardList", getGuardSchedule);
secureRouter.post(
  "/addMaintenanceList",
  verifyRoles("Student", "Professor", "Staff"),
  addMaintenanceList
);

secureRouter.post("/addLostAndFoundList", addLostAndFoundList);

secureRouter.patch("/updateStatus/:id", updateLostAndFoundList);

secureRouter.delete("/adminDeleteMaintenanceList/:id", verifyRoles("Professor", "Staff"), adminDeleteMaintenanceList);
secureRouter.delete("/deleteGuard/:id", deleteGuard);

secureRouter.get("/lostAndFound/interMap", getLostAndFoundInterMap);

secureRouter.get("/guards", fetchGuardData);

secureRouter.get("/gbuildings", fetchGBuildingData)

secureRouter.post("/gbookings", createGBooking)

export { secureRouter };

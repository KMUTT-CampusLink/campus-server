import { Router } from "express";
import { getBuilding } from "../controllers/getBuilding.js";
import { getFloor } from "../controllers/getFloor.js";
import { getRoom } from "../controllers/getRoom.js";
// import your logics from controllers here
import { getLostAndFoundList } from "../controllers/getLostAndFoundList.js";
import { getMaintenanceList } from "../controllers/getMaintenanceList.js";
import { addMaintenanceRequest } from "../controllers/addMaintenanceList.js";
import { addLostAndFoundList } from "../controllers/addLostAndFoundList.js";
import { updateLostAndFoundList } from "../controllers/updateLostAndFoundList.js";
import { deleteReturned } from "../controllers/deleteReturned.js";
const secureRouter = Router();

// create routes here
secureRouter.get("/", (req, res) => {
  return res.send("Building and Security");
});

secureRouter.get("/building", getBuilding);
secureRouter.get("/floor", getFloor);
secureRouter.get("/room", getRoom);
secureRouter.get("/LostAndFoundList", getLostAndFoundList);
secureRouter.get("/MaintenanceList", getMaintenanceList);
secureRouter.post("/addMaintenanceList", addMaintenanceRequest);
secureRouter.post("/addLostAndFoundList", addLostAndFoundList);
secureRouter.patch("/updateStatus/:id", updateLostAndFoundList);
secureRouter.delete("/deleteReturned", deleteReturned);

export { secureRouter };

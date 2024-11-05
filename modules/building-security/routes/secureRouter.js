import { Router } from "express";
// import your logics from controllers here
import { getLostAndFoundList } from "../controllers/getLostAndFoundList.js";
import { getMaintenanceList } from "../controllers/getMaintenanceList.js";
import { addMaintenanceRequest } from "../controllers/addMaintenanceList.js";
import { addLostAndFoundList } from "../controllers/addLostAndFoundList.js";
const secureRouter = Router();

// create routes here
secureRouter.get("/", (req, res) => {
  return res.send("Building and Security");
});
secureRouter.get("/LostAndFoundList", getLostAndFoundList);
secureRouter.get("/MaintenanceList", getMaintenanceList);
secureRouter.post("/addMaintenanceList", addMaintenanceRequest);
secureRouter.post("/addLostAndFoundList", addLostAndFoundList);


export { secureRouter };

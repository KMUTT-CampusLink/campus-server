import { Router } from "express";
// import your logics from controllers here
import { getLostAndFoundList } from "../controllers/getLostAndFoundList.js";
import { getMaintenanceList } from "../controllers/getMaintenanceList.js";

const secureRouter = Router();

// create routes here
secureRouter.get("/", (req, res) => {
  return res.send("Building and Security");
});
secureRouter.get("/LostAndFoundList", getLostAndFoundList);
secureRouter.get("/MaintenanceList", getMaintenanceList);

export { secureRouter };

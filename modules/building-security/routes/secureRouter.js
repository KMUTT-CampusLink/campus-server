import { Router } from "express";
import { getBuilding } from "../controllers/getBuilding.js";
import { getFloor } from "../controllers/getFloor.js";
import { getRoom } from "../controllers/getRoom.js";
// import your logics from controllers here

const secureRouter = Router();

// create routes here
secureRouter.get("/", (req, res) => {
  return res.send("Building and Security");
});
secureRouter.get("/building", getBuilding);
secureRouter.get("/floor", getFloor);
secureRouter.get("/room", getRoom);
export { secureRouter };

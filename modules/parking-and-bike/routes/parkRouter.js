import { Router } from "express";
import { getParking } from "../controllers/getParking.js";
import { getBuildingById } from "../controllers/getBuildingById.js";
import { postReservation } from "../controllers/postReservation.js";

const parkRouter = Router();

parkRouter.get("/", (req, res) => {
  return res.send("Parkings System");
});

parkRouter.get("/getParking", getParking );
parkRouter.get("/getBuildingById/:building_id", getBuildingById)
parkRouter.post("/postReservation", postReservation)

export { parkRouter };
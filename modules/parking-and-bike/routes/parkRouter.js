import { Router } from "express";
import { getParking } from "../controllers/getParking.js";
import { getBuildingById } from "../controllers/getBuildingById.js";
// import { getFloorById } from "../controllers/getFloorById.js";
import { postReservation } from "../controllers/postReservation.js";
import { deleteReservation } from "../controllers/deleteReservation.js";

const parkRouter = Router();

parkRouter.get("/", (req, res) => {
  return res.send("Parkings System");
});

parkRouter.get("/getParking", getParking);
parkRouter.get("/getBuildingById/:building_id", getBuildingById);
// parkRouter.get("/getFloorById/:floor_id", getFloorById)
parkRouter.post("/postReservation", postReservation);
parkRouter.delete("/deleteReservation/:reservation_id", deleteReservation);

parkRouter.get("/getParking", getParking);
parkRouter.get("/getBuildingById/:building_id", getBuildingById);
parkRouter.post("/postReservation", postReservation);

export { parkRouter };

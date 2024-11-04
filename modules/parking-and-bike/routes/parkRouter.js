import { Router } from "express";
import { getParking } from "../controllers/getParking.js";
import { getBuildingById } from "../controllers/getBuildingById.js";
// import { getFloorById } from "../controllers/getFloorById.js";
import { postReservation } from "../controllers/postReservation.js";
import { deleteReservation } from "../controllers/deleteReservation.js";
import { getCar } from "../controllers/getCar.js";

const parkRouter = Router();

parkRouter.get("/", (req, res) => {
  return res.send("Parkings System");
});

parkRouter.get("/getParking", getParking );
parkRouter.get("/getBuildingById/:building_id", getBuildingById)
// parkRouter.get("/getFloorById/:floor_id", getFloorById)
parkRouter.get("/getCar/:license_no", getCar)
parkRouter.post("/postReservation", postReservation)
parkRouter.delete("/deleteReservation/:reservation_id", deleteReservation)

export { parkRouter };

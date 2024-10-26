import { Router } from "express";
import { getAllBuildings } from "../controllers/getAllBuildings.js";
import { getParking } from "../controllers/getParking.js";
// import your logics from controllers here

const parkRouter = Router();

parkRouter.get("/", (req, res) => {
  return res.send("Parkings System");
});
parkRouter.get("/getAllBuildings", getAllBuildings);
parkRouter.get("/getParking", getParking );
// create routes here

export { parkRouter };

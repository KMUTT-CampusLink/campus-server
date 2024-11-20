import { Router } from "express";
import { checkUnpaidInvoices } from "../middlewares/checkUnpaidInvoices.js";

import { getParking } from "../controllers/getParking.js";
import { getBuildingById } from "../controllers/getBuildingById.js";
// import { getFloorById } from "../controllers/getFloorById.js";
import { postReservation } from "../controllers/postReservation.js";
import { deleteReservation } from "../controllers/deleteReservation.js";
import { getCar } from "../controllers/getCar.js";
import { postCheckout } from "../controllers/postCheckout.js";
import { postCheckin } from "../controllers/postCheckIn.js";
import { postHelp } from "../controllers/postHelp.js";
import { postRegisterCar } from "../controllers/postRegisterCar.js";


const parkRouter = Router();

parkRouter.use(checkUnpaidInvoices); // if not paid for 1 year gonna block!

parkRouter.get("/", checkUnpaidInvoices, (req, res) => {
  return res.send("Parkings System");
});

parkRouter.get("/getParking", checkUnpaidInvoices, getParking );
parkRouter.get("/getBuildingById/:building_id", checkUnpaidInvoices, getBuildingById)
// parkRouter.get("/getFloorById/:floor_id", checkUnpaidInvoices, getFloorById)
parkRouter.get("/getCar", checkUnpaidInvoices, getCar)
parkRouter.delete("/deleteReservation/:reservation_id", checkUnpaidInvoices, deleteReservation)
parkRouter.post("/postReservation", checkUnpaidInvoices, postReservation)
parkRouter.post("/postCheckin", checkUnpaidInvoices, postCheckin)
parkRouter.post("/postCheckout", checkUnpaidInvoices, postCheckout)
parkRouter.post("/postHelp", checkUnpaidInvoices, postHelp)
parkRouter.post("/postRegisterCar", checkUnpaidInvoices, postRegisterCar)

export { parkRouter };

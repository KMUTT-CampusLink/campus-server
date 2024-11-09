import { Router } from "express";
import verifyRoles from "../../../core/middleware/verifyRoles.js";
import {
  queryBookingsForTripByID,
  queryDriverTrips,
} from "../controllers/driver/dataQueries.js";

const driverRouter = Router();

driverRouter.use(verifyRoles("Driver"));

driverRouter.get("/tripBookings/:tripID", queryBookingsForTripByID);
driverRouter.get("/trips", queryDriverTrips);

export default driverRouter;

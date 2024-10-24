import { Router } from "express";
// import your logics from controllers here
import { populateDatabaseWithTestData } from "../utils/populateDatabaseWithTestData.js";
import { queryAllData } from "../utils/queryAllData.js";
import {
  queryRoutesConnectingTwoStops,
  queryRoutesByStopId,
} from "../controllers/user/dataQueries.js";
import { queryBookingsForTripByID } from "../controllers/driver/dataQueries.js";

const transRouter = Router();

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation");
});

transRouter.post("/driver/tripBookings", queryBookingsForTripByID);
transRouter.get("/populate", populateDatabaseWithTestData);
transRouter.get("/queryAllData", queryAllData);
transRouter.get("/user/routesConnectingStops", queryRoutesConnectingTwoStops);
transRouter.get("/user/routesAtStop", queryRoutesByStopId);

export { transRouter };

import { Router } from "express";
// import your logics from controllers here
import { populateDatabaseWithTestData } from "../utils/populateDatabaseWithTestData.js";
import { queryAllData } from "../utils/queryAllData.js";
import { queryBookingsForTripByID } from "../controllers/driver/dataQueries.js";
import {
  queryAllStops,
  queryTripsByRouteID,
  queryRoutesConnectingStops,
  queryUserBookings,
} from "../controllers/user/dataQueries.js";

const transRouter = Router();

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation api");
});

transRouter.get("/driver/tripBookings/:tripID", queryBookingsForTripByID);
transRouter.get("/populate", populateDatabaseWithTestData);
transRouter.get("/queryAllData", queryAllData);

// routes for booking db operations
transRouter.get("/user/queryAllStops", queryAllStops); //done on frontend api
transRouter.get(
  "/user/routesConnectingStops/:startStopID/:endStopID",
  queryRoutesConnectingStops
); //done on frontend api
transRouter.get("/user/tripsByRouteID/:routeID", queryTripsByRouteID); //done on frontend api
transRouter.get("/user/bookings", queryUserBookings);

export { transRouter };

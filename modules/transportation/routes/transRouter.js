import { Router } from "express";
// import your logics from controllers here
import { populateDatabaseWithTestData } from "../utils/populateDatabaseWithTestData.js";
import { queryAllData } from "../utils/queryAllData.js";
import { queryBookingsForTripByID } from "../controllers/driver/dataQueries.js";
import {
  queryAllStops,
  queryTripsByRouteID,
  queryRoutesConnectingStops,
  queryRoutesByStopID,
  queryUserBookings,
  queryStopsByRouteID,
} from "../controllers/user/dataQueries.js";

const transRouter = Router();

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation api");
});

transRouter.get("/driver/tripBookings/:tripID", queryBookingsForTripByID);
transRouter.get("/populate", populateDatabaseWithTestData);
transRouter.get("/queryAllData", queryAllData);
transRouter.get("/user/queryAllStops", queryAllStops); //done on frontend api
transRouter.get(
  "/user/routesConnectingStops/:startStopID/:endStopID",
  queryRoutesConnectingStops
); //done on frontend api
transRouter.get("/user/routesAtStop/:stopID", queryRoutesByStopID);
transRouter.get("/user/tripsByRouteID/:routeID", queryTripsByRouteID);
transRouter.get("/user/queryBookingsForTrip/:tripID", queryBookingsForTripByID); //done on frontend api
transRouter.get("/user/queryUserBookings", queryUserBookings);

export { transRouter };

import { Router } from "express";
// import your logics from controllers here
import populateDatabaseWithTestData from "../utils/populateDatabaseWithTestData.js";
import queryAllData from "../utils/queryAllData.js";
import showRoutesBetweenStops from "../utils/graphQueries.js";
import queryBookingsForTrip from "../controllers/driver/dataQueries.js";

const transRouter = Router();

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation");
});

transRouter.get("/tripBookings", queryBookingsForTrip);
transRouter.get("/test");
transRouter.get("/populate", populateDatabaseWithTestData);
transRouter.get("/queryAllData", queryAllData);
transRouter.get("/routesBetweenStops", showRoutesBetweenStops);

export { transRouter };

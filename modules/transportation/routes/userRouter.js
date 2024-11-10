import { Router } from "express";
import verifyRoles from "../../../core/middleware/verifyRoles.js";
import { bookForTrip } from "../controllers/user/book.js";
import {
  queryAllStops,
  queryAllTripData,
  queryRoutesConnectingStops,
  queryTripsByRouteID,
  queryUserBookings,
  isBooked,
} from "../controllers/user/dataQueries.js";

const userRouter = new Router();

userRouter.use(verifyRoles("Student"));

userRouter.get("/isBooked/:tripID", isBooked);

userRouter.get("/queryAllStops", queryAllStops); //done on frontend api
userRouter.get(
  "/routesConnectingStops/:startStopID/:endStopID",
  queryRoutesConnectingStops
); //done on frontend api
userRouter.get("/tripsByRouteID/:routeID", queryTripsByRouteID); //done on frontend api
userRouter.get("/bookings", queryUserBookings); //done on frontend api
userRouter.get("/tripData/:tripID", queryAllTripData); //done on frontend api
userRouter.post("/book", bookForTrip); //done on frontend api

export default userRouter;

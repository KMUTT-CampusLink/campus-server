import { Router } from "express";
// import your logics from controllers here
import { populateDatabaseWithTestData } from "../utils/populateDatabaseWithTestData.js";
import { queryAllData } from "../utils/queryAllData.js";
import {
  queryBookingsForTripByID,
  queryDriverTrips,
} from "../controllers/driver/dataQueries.js";

import userRouter from "./userRouter.js";

const transRouter = Router();

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation api");
});

transRouter.get("/driver/tripBookings/:tripID", queryBookingsForTripByID);
transRouter.get("/driver/trips", queryDriverTrips);

// dangerous for db, deletes all used tables first
transRouter.get("/populate", populateDatabaseWithTestData);
transRouter.get("/queryAllData", queryAllData);

transRouter.use("/user", userRouter);

export { transRouter };

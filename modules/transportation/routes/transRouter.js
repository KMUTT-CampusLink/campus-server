import { Router } from "express";
import { populateDatabaseWithTestData } from "../utils/populateDatabaseWithTestData.js";
import { queryAllData } from "../utils/queryAllData.js";

import userRouter from "./userRouter.js";
import driverRouter from "./driverRouter.js";
import errorHandler from "../middleware/errorHandler.js";

const transRouter = Router();

transRouter.use(errorHandler);
transRouter.use("/user", userRouter);
transRouter.use("/driver", driverRouter);

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation api");
});
// dangerous for db, deletes all used tables first
transRouter.get("/populate", populateDatabaseWithTestData);
transRouter.get("/queryAllData", queryAllData);

export { transRouter };

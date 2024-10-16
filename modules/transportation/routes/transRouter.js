import { Router } from "express";
// import your logics from controllers here
import showBookingsForDrive from "../controllers/driver/showBookingsForDrive.js";
import testDB from "../controllers/driver/testDB.js";
import populateDatabaseWithTestData from "../utils/populateDatabaseWithTestData.js";
import queryAllData from "../utils/queryAllData.js";
import { queryObjects } from "v8";

const transRouter = Router();

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation");
});

transRouter.get("/showBookingsForDrive", showBookingsForDrive);
transRouter.get("/test", testDB);
transRouter.get("/populate", populateDatabaseWithTestData);
transRouter.get("/queryAllData", queryAllData);

export { transRouter };

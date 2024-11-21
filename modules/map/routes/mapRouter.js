import { Router } from "express";
import { getAllDepartments } from "../controllers/getAllDepartments.js";
import { getAllContactNumber } from "../controllers/getAllContactNumbers.js";
import { getAllComplaint } from "../controllers/getAllComplaint.js";
import {getParking} from "../../parking-and-bike/controllers/getParking.js";
import { getAllLostAndFound } from "../controllers/getAllLostAndFound.js";

const mapRouter = Router();

mapRouter.get("/departments", getAllDepartments);
mapRouter.get("/contacts", getAllContactNumber);
mapRouter.get("/complaints", getAllComplaint);
mapRouter.get("/getParking", getParking);
mapRouter.get("/getAllLostAndFound", getAllLostAndFound);



export { mapRouter };

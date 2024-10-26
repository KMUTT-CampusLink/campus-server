import { Router } from "express";
import { getAllDepartments } from "../controllers/getAllDepartments.js";
import { editDepartmentDetail } from "../controllers/editDepar.js";
import { getAllContactNumber } from "../controllers/getAllContactNumbers.js";
import { getAllComplaint } from "../controllers/getAllComplaint.js";

const mapRouter = Router();

mapRouter.get("/departments", getAllDepartments);
mapRouter.get("/contacts", getAllContactNumber);
mapRouter.get("/complaints", getAllComplaint);

mapRouter.patch("/editDepartment", editDepartmentDetail);



export { mapRouter };

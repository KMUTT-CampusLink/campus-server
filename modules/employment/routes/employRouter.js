import { Router } from "express";
import getEmployee from '../controller/geEmployees.js';
import createEmployee from '../controller/createUser.js';
import getEmployeeById from '../controller/getEmployeeId.js';

const employRouter = Router();

// create routes here
employRouter.get("/get", getEmployee);
employRouter.post("/post",createEmployee);
employRouter.get("/get/:id",getEmployeeById);

export { employRouter };

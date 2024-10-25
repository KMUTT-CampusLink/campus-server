import { Router } from "express";
import getEmployee from '../controller/geEmployees.js';
import createEmployee from '../controller/createUser.js';
import getEmployeeById from '../controller/getEmployeeId.js';
import updateEmployee from '../controller/UpdateEmployee.js';
import deleteEmployee from '../controller/DeleteEmployee.js';

const employRouter = Router();

// create routes here
employRouter.get("/get", getEmployee);
employRouter.post("/post",createEmployee);
employRouter.get("/get/:id",getEmployeeById);
employRouter.post("/update/:id",updateEmployee);
employRouter.delete('/delete/:id',deleteEmployee);


export { employRouter };

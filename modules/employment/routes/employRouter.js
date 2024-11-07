import { Router } from "express";
import getEmployee from '../controller/geEmployees.js';
import createEmployee from '../controller/createEmployee.js';
import getEmployeeById from '../controller/getEmployeeId.js';
import updateEmployee from '../controller/UpdateEmployee.js';
import deleteEmployee from '../controller/DeleteEmployee.js';

const employRouter = Router();

// create routes here
employRouter.get("/getEmp", getEmployee);
employRouter.post("/postEmp",createEmployee);
employRouter.get("/getEmp/:id",getEmployeeById);
employRouter.post("/updateEmp/:id",updateEmployee);
employRouter.delete('/deleteEmp/:id',deleteEmployee);

employRouter.get("/getStu/", getEmployee);
employRouter.post("/postStu",createEmployee);
employRouter.get("/getStu/:id",getEmployeeById);
employRouter.post("/updateStu/:id",updateEmployee);
employRouter.delete('/deleteStu/:id',deleteEmployee);


export { employRouter };

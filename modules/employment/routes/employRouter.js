import { Router } from "express";
import getEmployee from "../controller/geEmployees.js";
import createEmployee from "../controller/createEmployee.js";
import getEmployeeById from "../controller/getEmployeeId.js";
import updateEmployee from "../controller/UpdateEmployee.js";
import deleteEmployee from "../controller/DeleteEmployee.js";
import getStudents from "../controller/getStudents.js";
import getStudentsId from "../controller/getStudentId.js";
import deleteStudent from "../controller/deleteStudent.js";
import getFaculties from "../controller/getFalcuty.js";
import getProgramName from "../controller/getProgramName.js";
import getSemester from "../controller/getSemester.js";
import createStudent from "../controller/createStudent.js";
import updateStudent from "../controller/updateStudent.js";
 
const employRouter = Router();
 
// create routes here
employRouter.get("/getEmp", getEmployee);
employRouter.post("/postEmp", createEmployee);
employRouter.get("/getEmp/:id", getEmployeeById);
employRouter.post("/updateEmp/:id", updateEmployee);
employRouter.delete("/deleteEmp/:id", deleteEmployee);
 
employRouter.get("/getStu/", getStudents);
employRouter.post("/postStu", createStudent);
employRouter.get("/getStu/:id", getStudentsId);
employRouter.post("/updateStu/:id", updateStudent);
employRouter.delete("/deleteStu/:id", deleteStudent);
 
employRouter.get("/getFaculty", getFaculties);
employRouter.get("/getProgramName", getProgramName);
employRouter.get("/getSemester", getSemester);
 
export { employRouter };

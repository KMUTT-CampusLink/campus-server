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
import getCourse from "../controller/getCourse.js";
import createCourse from "../controller/createCourse.js";
import updateCourse from "../controller/updateCourse.js";
import getCourseSection from "../controller/getCourseSection.js";
import createSection from "../controller/createSection.js";
import updateSection from "../controller/updateSection.js";
import getSection from "../controller/getSection.js";
import deleteSection from "../controller/deleteSection.js";
import deleteCourse from "../controller/deleteCourse.js";
import file_uploader from "../../../core/middleware/multerUploader.js";
import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import getRoom from "../controller/getRoom.js";
import getProgram from "../controller/getProgram.js";
import getCourseDetail from "../controller/getCourseDetails.js";
import fetchProfessor from "../controller/fetchProfessor.js";

const employRouter = Router();

// create routes here
employRouter.get("/getEmp", getEmployee);
employRouter.post(
  "/postEmp",
  file_uploader.single("empImage"),
  multerErrorHandler,
  createEmployee
);
employRouter.get("/getEmp/:id", getEmployeeById);
employRouter.post(
  "/updateEmp/:id",
  file_uploader.single("empImage"),
  multerErrorHandler,
  updateEmployee
);
employRouter.delete("/deleteEmp/:id", deleteEmployee);

employRouter.get("/getStu/", getStudents);
employRouter.post(
  "/postStu",
  file_uploader.single("stuImage"),
  multerErrorHandler,
  createStudent
);
employRouter.get("/getStu/:id", getStudentsId);
employRouter.post(
  "/updateStu/:id",
  file_uploader.single("stuImage"),
  multerErrorHandler,
  updateStudent
);
employRouter.delete("/deleteStu/:id", deleteStudent);

employRouter.get("/getCourse", getCourse);
employRouter.post(
  "/postCourse",
  file_uploader.single("courseImage"),
  multerErrorHandler,
  createCourse
);
employRouter.post(
  "/updateCourse/:id",
  file_uploader.single("courseImage"),
  multerErrorHandler,
  updateCourse
);
employRouter.delete("/deleteCourse/:code", deleteCourse);
employRouter.get("/getCourseSection/:code", getCourseSection);

employRouter.get("/getSection/:code/:id", getSection);
employRouter.post("/postSection/:id", createSection);
employRouter.post("/updateSection/:code/:id", updateSection);
employRouter.delete("/deleteSection/:code/:id", deleteSection);

employRouter.get("/getFaculty", getFaculties);
employRouter.get("/getProgramName", getProgramName);
employRouter.get("/getProgram", getProgram);
employRouter.get("/getSemester", getSemester);
employRouter.get("/getRoom", getRoom);
employRouter.get("/getCourseDetail/:code", getCourseDetail);
employRouter.get("/fetchProfessor", fetchProfessor);

export { employRouter };

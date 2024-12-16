import { Router } from "express";
import generateQrCode from "../controllers/qrGenerate.js";
import { validateQrCodeController } from "../controllers/qrValidation.js";
import generateFaceRecAttendance from "../controllers/faceAttendanceGenerate.js";
import { markAttendance } from "../controllers/markAttendance.js";
import getAttendanceBySecId from "../controllers/getAttendanceBySecId.js";
import searchName from "../controllers/searchName.js";
//import { loadFaceDescriptors, compareFace } from "../controllers/faceRecognition.js";
import express from "express";
import getCourseDetail from "../controllers/getCourseHeader.js";
import getEnrollStudent from "../controllers/getStudentEnroll.js";
import updateAttendance from "../controllers/updateAttendance.js";
// import your logics from controllers here

const attendRouter = Router();

// create routes here
// attendRouter.post("/verify-face", express.json(), async (req, res) => {
//   try {
//     const { imagePath } = req.body;  
//     const descriptors = await loadFaceDescriptors();
//     const matchedId = await compareFace(imagePath, descriptors);

//     if (matchedId) {
//       res.json({ success: true, studentId: matchedId });
//     } else {
//       res.status(400).json({ success: false, message: "No match found" });
//     }
//   } catch (error) {
//     console.error("Error processing face recognition:", error);
//     res.status(500).json({ success: false, message: "Error processing image" });
//   }
// });

attendRouter.get("/", (req, res) => {
  return res.send("Attendance");
});
attendRouter.post("/qrGen/:secId", generateQrCode);
attendRouter.get("/validate/:attendanceId", validateQrCodeController );
attendRouter.post("/faceGen/:secId", generateFaceRecAttendance)
attendRouter.post("/markAttendance", markAttendance)
attendRouter.post("/update", updateAttendance)
attendRouter.get("/attendData/:sectionID",getAttendanceBySecId)
attendRouter.get("/search", searchName)
attendRouter.get("/course/:sectionID", getCourseDetail)
attendRouter.get("/getStudentBySecId/:sectionID", getEnrollStudent)
export { attendRouter };
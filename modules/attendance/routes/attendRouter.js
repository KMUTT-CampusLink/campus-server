import { Router } from "express";
import generateQrCode from "../controllers/qrGenerate.js";

// import your logics from controllers here

const attendRouter = Router();

// create routes here
attendRouter.get("/", (req, res) => {
  return res.send("Attendance");
});
attendRouter.post("/qrGen", generateQrCode);
attendRouter.post("/scan-qr", );
export { attendRouter };

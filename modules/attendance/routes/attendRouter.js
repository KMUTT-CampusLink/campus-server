import { Router } from "express";
// import your logics from controllers here

const attendRouter = Router();

// create routes here
attendRouter.get("/", (req, res) => {
  return res.send("Attendance");
});

export { attendRouter };

import { Router } from "express";
// import your logics from controllers here

const examRouter = Router();

// create routes here
examRouter.get("/", (req, res) => {
  return res.send("Online Exam");
});

export { examRouter };

import { Router } from "express";
// import your logics from controllers here

const courseRouter = Router();

// create routes here
courseRouter.get("/", (req, res) => {
  return res.send("Online Course");
});

export { courseRouter };

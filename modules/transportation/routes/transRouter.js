import { Router } from "express";
// import your logics from controllers here

const transRouter = Router();

// create routes here
transRouter.get("/", (req, res) => {
  return res.send("Transportation");
});

export { transRouter };

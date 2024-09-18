import { Router } from "express";
// import your logics from controllers here

const employRouter = Router();

// create routes here
employRouter.get("/", (req, res) => {
  return res.send("Employment Management");
});

export { employRouter };

import { Router } from "express";
// import your logics from controllers here

const regisRouter = Router();

// create routes here
regisRouter.get("/", (req, res) => {
  return res.send("Registration");
});

export { regisRouter };

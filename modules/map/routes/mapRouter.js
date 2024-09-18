import { Router } from "express";
// import your logics from controllers here

const mapRouter = Router();

// create routes here
mapRouter.get("/", (req, res) => {
  return res.send("Interactive Map");
});

export { mapRouter };

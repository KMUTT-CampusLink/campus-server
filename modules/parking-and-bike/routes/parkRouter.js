import { Router } from "express";
// import your logics from controllers here

const parkRouter = Router();

// create routes here
parkRouter.get("/", (req, res) => {
  return res.send("Parking and Bike");
});

export { parkRouter };

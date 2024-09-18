import { Router } from "express";
// import your logics from controllers here

const clubRouter = Router();

// create routes here
clubRouter.get("/", (req, res) => {
  return res.send("Clubs Management");
});

export { clubRouter };

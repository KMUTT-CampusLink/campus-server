import { Router } from "express";
// import your logics from controllers here

const libRouter = Router();

// create routes here
libRouter.get("/", (req, res) => {
  return res.send("Library System");
});

export { libRouter };

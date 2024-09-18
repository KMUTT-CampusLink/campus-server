import { Router } from "express";
// import your logics from controllers here

const secureRouter = Router();

// create routes here
secureRouter.get("/", (req, res) => {
  return res.send("Building and Security");
});

export { secureRouter };

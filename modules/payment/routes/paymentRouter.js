import { Router } from "express";
// import your logics from controllers here

const paymentRouter = Router();

// create routes here
paymentRouter.get("/", (req, res) => {
  return res.send("Payment");
});

export { paymentRouter };

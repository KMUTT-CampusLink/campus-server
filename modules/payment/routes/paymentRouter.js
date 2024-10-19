import { Router } from "express";
// import your logics from controllers here
import { getAllInvoice } from "../controller/getAllInvoice.js" ;

const paymentRouter = Router();
paymentRouter.get("/invoice", getAllInvoice);
// create routes here

paymentRouter.get("/pay", (req, res) => {
  
});

paymentRouter.get("/", (req, res) => {
  return res.send("Payment");
});

export { paymentRouter };

import { Router } from "express";
// import your logics from controllers here
import { getAllInvoice } from "../controller/getAllInvoice.js";
import { connectPaymentGateway } from "../controller/connectPaymentGateway.js";

const paymentRouter = Router();

paymentRouter.get("/invoice", async (req, res) => {
  const { id } = req.query; // Extracting 'id' from the query parameters for testing purpose
  if (id) {
    try {
      // Calling the getAllInvoice function and passing req, res
      await getAllInvoice(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "User ID is required" });
  }
});

paymentRouter.post("/pay", (req, res) => {
  const { inv } = req.body;
  if (inv) {
    try {
      connectPaymentGateway(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invoice ID is required" });
  }
});

paymentRouter.get("/", (req, res) => {
  return res.send("Payment");
});

export { paymentRouter };